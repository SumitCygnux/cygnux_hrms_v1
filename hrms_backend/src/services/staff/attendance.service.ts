import { getTenantConnection } from "../../connection/tenant.connection";
import { StaffAttendance, AttendanceStatus } from "../../entity/tenant/staff/staff.attandance.entity";
import dayjs from "dayjs";
import { Between } from "typeorm";

const getTodayDate = () => dayjs().format("YYYY-MM-DD");

export const clockInService = async (dbName: string, staffId: number) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const today = getTodayDate();
  const existing = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (existing) {
    throw new Error("Already clocked in for today");
  }

  const attendance = attendanceRepo.create({
    staffId,
    date: today,
    clockIn: new Date(),
    status: AttendanceStatus.PRESENT,
    breaks: [],
    workingHours: 0,
  });

  return await attendanceRepo.save(attendance);
};

export const clockOutService = async (dbName: string, staffId: number) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance) {
    throw new Error("No clock-in record found for today");
  }

  if (attendance.clockOut) {
    throw new Error("Already clocked out for today");
  }

  const now = new Date();
  attendance.clockOut = now;

  // If currently on break, auto-end it
  if (attendance.breaks.length > 0) {
    const lastBreak = attendance.breaks[attendance.breaks.length - 1];
    if (!lastBreak.breakIn) {
      lastBreak.breakIn = now;
    }
  }

  // Calculate working hours
  const totalMs = now.getTime() - new Date(attendance.clockIn!).getTime();
  let breakMs = 0;

  for (const b of attendance.breaks) {
    if (b.breakIn) {
      breakMs += new Date(b.breakIn).getTime() - new Date(b.breakOut).getTime();
    }
  }

  const activeMs = Math.max(0, totalMs - breakMs);
  const hours = activeMs / (1000 * 60 * 60);
  attendance.workingHours = Number(hours.toFixed(2));

  return await attendanceRepo.save(attendance);
};

export const startBreakService = async (dbName: string, staffId: number) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance) {
    throw new Error("Must clock in before starting a break");
  }

  if (attendance.clockOut) {
    throw new Error("Already clocked out for today");
  }

  if (attendance.breaks.length > 0) {
    const lastBreak = attendance.breaks[attendance.breaks.length - 1];
    if (!lastBreak.breakIn) {
      throw new Error("Already on break");
    }
  }

  attendance.breaks.push({ breakOut: new Date() });
  return await attendanceRepo.save(attendance);
};

export const endBreakService = async (dbName: string, staffId: number) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance) {
    throw new Error("No attendance record found for today");
  }

  if (attendance.clockOut) {
    throw new Error("Already clocked out for today");
  }

  if (attendance.breaks.length === 0) {
    throw new Error("Not currently on break");
  }

  const lastBreak = attendance.breaks[attendance.breaks.length - 1];
  if (lastBreak.breakIn) {
    throw new Error("Not currently on break");
  }

  lastBreak.breakIn = new Date();
  return await attendanceRepo.save(attendance);
};

export const getTodayAttendanceService = async (dbName: string, staffId: number) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const today = getTodayDate();
  return await attendanceRepo.findOne({ where: { staffId, date: today } });
};

export const getAttendanceHistoryService = async (
  dbName: string,
  staffId: number,
  startDate?: string,
  endDate?: string
) => {
  const dataSource = await getTenantConnection(dbName);
  const attendanceRepo = dataSource.getRepository(StaffAttendance);

  const filter: any = { staffId };

  if (startDate && endDate) {
    filter.date = Between(startDate, endDate);
  }

  return await attendanceRepo.find({
    where: filter,
    order: { date: "DESC" },
  });
};
