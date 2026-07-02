import { getTenantConnection } from "../../connection/tenant.connection";
import {
  StaffAttendance,
  AttendanceStatus,
  ClockOutApproval,
  BreakSession,
} from "../../entity/tenant/staff/staff.attandance.entity";
import { AttendanceSettings } from "../../entity/tenant/attendanceSettings.entity";
import { Holiday } from "../../entity/tenant/holiday.entity";
import { Shift } from "../../entity/tenant/shift.entity";
import {
  AttendanceRequest,
  AttendanceRequestType,
} from "../../entity/tenant/attendanceRequest.entity";
import dayjs from "dayjs";
import { Between } from "typeorm";
import {
  resolveActiveShift,
  computeArrival,
  finalizeWorkingTime,
  calcBreakMinutes,
  findHoliday,
  isWeeklyOff,
  parseDevice,
  getStaffDepartmentId,
} from "../../utils/attendance.util";

const getTodayDate = () => dayjs().format("YYYY-MM-DD");

interface ClockMeta {
  ip?: string | null;
  userAgent?: string | null;
}

const loadSettings = async (ds: any): Promise<AttendanceSettings> => {
  const repo = ds.getRepository(AttendanceSettings);
  let settings = await repo.findOne({ where: { id: 1 } });
  if (!settings) {
    settings = repo.create({ id: 1 });
    settings = await repo.save(settings);
  }
  return settings;
};

export const clockInService = async (
  dbName: string,
  staffId: number,
  meta: ClockMeta = {}
) => {
  const ds = await getTenantConnection(dbName);
  const attendanceRepo = ds.getRepository(StaffAttendance);

  const today = getTodayDate();
  const existing = await attendanceRepo.findOne({ where: { staffId, date: today } });
  if (existing && existing.clockIn) {
    throw new Error("Already clocked in for today");
  }

  const now = new Date();
  const settings = await loadSettings(ds);
  const shift = await resolveActiveShift(ds, staffId, today);
  const { device, browser } = parseDevice(meta.userAgent || undefined);

  const arrival = computeArrival(shift, settings, now, today);

  // Re-use an existing (e.g. system-marked Weekly Off / Holiday / Absent) row if present.
  const record = existing || attendanceRepo.create({ staffId, date: today, breaks: [] });
  record.clockIn = now;
  record.clockOut = null;
  record.breaks = [];
  record.status = arrival.status;
  record.lateMinutes = arrival.lateMinutes;
  record.shiftId = shift ? shift.id : null;
  record.clockOutApproval = ClockOutApproval.AUTO;
  record.workingHours = 0;
  record.ipAddress = meta.ip ?? null;
  record.device = device;
  record.browser = browser;

  return attendanceRepo.save(record);
};

export const startBreakService = async (
  dbName: string,
  staffId: number,
  body: { type?: string; remarks?: string } = {}
) => {
  const ds = await getTenantConnection(dbName);
  const attendanceRepo = ds.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance || !attendance.clockIn) throw new Error("Must clock in before starting a break");
  if (attendance.clockOut) throw new Error("Already clocked out for today");

  const breaks = (attendance.breaks || []) as BreakSession[];
  const open = breaks.find((b) => !b.end);
  if (open) throw new Error("Already on break");

  const now = new Date();
  breaks.push({
    start: now,
    end: null,
    type: body.type || "Break",
    remarks: body.remarks || null,
  });
  attendance.breaks = breaks;
  attendance.breakIn = now;
  attendance.breakOut = null;
  return attendanceRepo.save(attendance);
};

export const endBreakService = async (
  dbName: string,
  staffId: number,
  body: { remarks?: string } = {}
) => {
  const ds = await getTenantConnection(dbName);
  const attendanceRepo = ds.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance) throw new Error("No attendance record found for today");
  if (attendance.clockOut) throw new Error("Already clocked out for today");

  const breaks = (attendance.breaks || []) as BreakSession[];
  const open = breaks.find((b) => !b.end);
  if (!open) throw new Error("Not currently on break");

  const now = new Date();
  open.end = now;
  if (body.remarks) open.remarks = body.remarks;
  attendance.breaks = breaks;
  attendance.breakOut = now;
  attendance.breakIn = null;
  attendance.breakDuration = calcBreakMinutes(breaks);
  return attendanceRepo.save(attendance);
};

export const clockOutService = async (dbName: string, staffId: number, workSummary?: string) => {
  const ds = await getTenantConnection(dbName);
  const attendanceRepo = ds.getRepository(StaffAttendance);

  const today = getTodayDate();
  const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

  if (!attendance || !attendance.clockIn) throw new Error("No clock-in record found for today");
  if (attendance.clockOut) throw new Error("Already clocked out for today");

  const now = new Date();

  // Auto-close any ongoing break.
  const breaks = (attendance.breaks || []) as BreakSession[];
  const open = breaks.find((b) => !b.end);
  if (open) open.end = now;
  attendance.breaks = breaks;
  attendance.breakOut = now;
  attendance.breakIn = null;
  attendance.clockOut = now;
  if (workSummary) {
    attendance.notes = workSummary;
  }

  const settings = await loadSettings(ds);
  const shift = attendance.shiftId
    ? await ds.getRepository(Shift).findOne({ where: { id: attendance.shiftId } })
    : await resolveActiveShift(ds, staffId, today);

  const result = finalizeWorkingTime(attendance, shift, settings);
  attendance.workingHours = result.workingHours;
  attendance.breakDuration = result.breakDuration;
  attendance.overtimeMinutes = result.overtimeMinutes;
  attendance.earlyExitMinutes = result.earlyExitMinutes;
  attendance.status = result.status;

  if (settings.requireClockOutApproval) {
    attendance.clockOutApproval = ClockOutApproval.PENDING;
    await attendanceRepo.save(attendance);
    // Raise a clock-out approval request for the admin queue.
    const reqRepo = ds.getRepository(AttendanceRequest);
    await reqRepo.save(
      reqRepo.create({
        employeeId: staffId,
        requestType: AttendanceRequestType.CLOCK_OUT_APPROVAL,
        requestDate: today,
        reason: "Clock-out pending approval",
        status: "Pending",
        requestedBy: String(staffId),
        payload: {
          clockOut: now,
          workingHours: result.workingHours,
          status: result.status,
        },
      })
    );
    return attendance;
  }

  attendance.clockOutApproval = ClockOutApproval.AUTO;
  return attendanceRepo.save(attendance);
};

export const getTodayAttendanceService = async (dbName: string, staffId: number) => {
  const ds = await getTenantConnection(dbName);
  const today = getTodayDate();
  const attendance = await ds
    .getRepository(StaffAttendance)
    .findOne({ where: { staffId, date: today } });

  const shift = await resolveActiveShift(ds, staffId, today);
  return { attendance, shift };
};

export const getAttendanceHistoryService = async (
  dbName: string,
  staffId: number,
  startDate?: string,
  endDate?: string
) => {
  const ds = await getTenantConnection(dbName);
  const filter: any = { staffId };
  if (startDate && endDate) filter.date = Between(startDate, endDate);

  return ds.getRepository(StaffAttendance).find({
    where: filter,
    order: { date: "DESC" },
  });
};

export const getStaffDashboardService = async (dbName: string, staffId: number) => {
  const ds = await getTenantConnection(dbName);
  const attRepo = ds.getRepository(StaffAttendance);
  const today = getTodayDate();

  const [todayRecord, shift, deptId, holidaysRaw] = await Promise.all([
    attRepo.findOne({ where: { staffId, date: today } }),
    resolveActiveShift(ds, staffId, today),
    getStaffDepartmentId(ds, staffId),
    ds.getRepository(Holiday).find({ where: { isActive: true } }),
  ]);

  // Weekly hours (last 7 days incl. today)
  const weekStart = dayjs().subtract(6, "day").format("YYYY-MM-DD");
  const weekRecords = await attRepo.find({
    where: { staffId, date: Between(weekStart, today) },
  });
  const weekly: { name: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = dayjs().subtract(i, "day");
    const dStr = d.format("YYYY-MM-DD");
    const rec = weekRecords.find((r) => r.date === dStr);
    weekly.push({ name: d.format("ddd"), value: rec ? Number(rec.workingHours) : 0 });
  }

  // Monthly summary
  const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
  const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");
  const monthRecords = await attRepo.find({
    where: { staffId, date: Between(monthStart, monthEnd) },
  });
  const countBy = (s: string) => monthRecords.filter((r) => r.status === s).length;
  const monthly = {
    present: countBy(AttendanceStatus.PRESENT),
    late: countBy(AttendanceStatus.LATE),
    halfDay: countBy(AttendanceStatus.HALF_DAY),
    absent: countBy(AttendanceStatus.ABSENT),
    leave: countBy(AttendanceStatus.ON_LEAVE),
    wfh: countBy(AttendanceStatus.WORK_FROM_HOME),
    workedHours: Number(
      monthRecords.reduce((s, r) => s + Number(r.workingHours || 0), 0).toFixed(2)
    ),
  };

  // Upcoming holidays (next 60 days)
  const upcomingHolidays = holidaysRaw
    .filter((h) => {
      if (h.departmentId && deptId && h.departmentId !== deptId) return false;
      const hd = dayjs(h.holidayDate);
      const eff = h.isRecurring ? hd.year(dayjs().year()) : hd;
      return eff.isAfter(dayjs().subtract(1, "day")) && eff.isBefore(dayjs().add(60, "day"));
    })
    .sort((a, b) => dayjs(a.holidayDate).valueOf() - dayjs(b.holidayDate).valueOf())
    .slice(0, 5)
    .map((h) => ({
      id: h.id,
      holidayName: h.holidayName,
      holidayDate: h.holidayDate,
      holidayType: h.holidayType,
    }));

  // Pending requests
  const pendingRequests = await ds.getRepository(AttendanceRequest).count({
    where: { employeeId: staffId, status: "Pending" },
  });

  return {
    today: todayRecord,
    shift,
    isHolidayToday: !!findHoliday(holidaysRaw, today, deptId),
    isWeeklyOffToday: isWeeklyOff(shift, today),
    weekly,
    monthly,
    upcomingHolidays,
    pendingRequests,
  };
};

export const createAttendanceRequestService = async (
  dbName: string,
  staffId: number,
  data: any
) => {
  const ds = await getTenantConnection(dbName);
  const settings = await loadSettings(ds);

  const type = data.requestType || AttendanceRequestType.REGULARIZATION;
  if (!settings.allowRegularization && type !== AttendanceRequestType.SHIFT_CHANGE) {
    throw new Error("Regularization requests are disabled by the company");
  }
  if (type === AttendanceRequestType.SHIFT_CHANGE && !settings.allowShiftChangeRequest) {
    throw new Error("Shift change requests are disabled by the company");
  }
  if (!data.requestDate) throw new Error("Request date is required");
  if (!data.reason) throw new Error("Reason is required");

  const repo = ds.getRepository(AttendanceRequest);
  const request = repo.create({
    employeeId: staffId,
    requestType: type,
    requestDate: data.requestDate,
    reason: data.reason,
    status: "Pending",
    requestedBy: String(staffId),
    payload: data.payload || null,
  });
  return repo.save(request);
};

export const getMyRequestsService = async (dbName: string, staffId: number) => {
  const ds = await getTenantConnection(dbName);
  return ds.getRepository(AttendanceRequest).find({
    where: { employeeId: staffId },
    order: { createdAt: "DESC" },
  });
};

export const resetAttendanceService = async (dbName: string, staffId: number) => {
  const ds = await getTenantConnection(dbName);
  const today = getTodayDate();
  await ds.getRepository(StaffAttendance).delete({ staffId, date: today });
};
