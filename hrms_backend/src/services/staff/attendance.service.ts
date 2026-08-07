// import { getTenantConnection } from "../../connection/tenant.connection";
// import {
//   StaffAttendance,
//   AttendanceStatus,
//   ClockOutApproval,
//   BreakSession,
// } from "../../entity/tenant/staff/staff.attandance.entity";
// import { AttendanceSettings } from "../../entity/tenant/attendanceSettings.entity";
// import { Holiday } from "../../entity/tenant/holiday.entity";
// import { Shift } from "../../entity/tenant/shift.entity";
// import {
//   AttendanceRequest,
//   AttendanceRequestType,
// } from "../../entity/tenant/attendanceRequest.entity";
// import dayjs from "dayjs";
// import { Between } from "typeorm";
// import {
//   resolveActiveShift,
//   computeArrival,
//   finalizeWorkingTime,
//   calcBreakMinutes,
//   findHoliday,
//   isWeeklyOff,
//   parseDevice,
//   getStaffDepartmentId,
// } from "../../utils/attendance.util";

// const getTodayDate = () => dayjs().format("YYYY-MM-DD");

// interface ClockMeta {
//   ip?: string | null;
//   userAgent?: string | null;
// }

// const loadSettings = async (ds: any): Promise<AttendanceSettings> => {
//   const repo = ds.getRepository(AttendanceSettings);
//   let settings = await repo.findOne({ where: { id: 1 } });
//   if (!settings) {
//     settings = repo.create({ id: 1 });
//     settings = await repo.save(settings);
//   }
//   return settings;
// };

// export const clockInService = async (
//   dbName: string,
//   staffId: number,
//   meta: ClockMeta = {}
// ) => {
//   const ds = await getTenantConnection(dbName);
//   const attendanceRepo = ds.getRepository(StaffAttendance);

//   const today = getTodayDate();
//   const existing = await attendanceRepo.findOne({ where: { staffId, date: today } });
//   if (existing && existing.clockIn) {
//     throw new Error("Already clocked in for today");
//   }

//   const now = new Date();
//   const settings = await loadSettings(ds);
//   const shift = await resolveActiveShift(ds, staffId, today);
//   const { device, browser } = parseDevice(meta.userAgent || undefined);

//   const arrival = computeArrival(shift, settings, now, today);

//   const record = existing || attendanceRepo.create({ staffId, date: today, breaks: [] });
//   record.clockIn = now;
//   record.clockOut = null;
//   record.breaks = [];
//   record.status = arrival.status;
//   record.lateMinutes = arrival.lateMinutes;
//   record.shiftId = shift ? shift.id : null;
//   record.clockOutApproval = ClockOutApproval.AUTO;
//   record.workingHours = 0;
//   record.ipAddress = meta.ip ?? null;
//   record.device = device;
//   record.browser = browser;

//   return attendanceRepo.save(record);
// };
 
// export const startBreakService = async (
//   dbName: string,
//   staffId: number,
//   body: { type?: string; remarks?: string } = {}
// ) => {

//   const ds = await getTenantConnection(dbName);
//   const attendanceRepo = ds.getRepository(StaffAttendance);
 
//   const today = getTodayDate();
//   const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

//   if (!attendance || !attendance.clockIn) throw new Error("Must clock in before starting a break");
//   if (attendance.clockOut) throw new Error("Already clocked out for today");

//   const breaks = (attendance.breaks || []) as BreakSession[];
//   const open = breaks.find((b) => !b.end);
//   if (open) throw new Error("Already on break");

//   const now = new Date();
//   breaks.push({
//     start: now,
//     end: null,
//     type: body.type || "Break",
//     remarks: body.remarks || null,
//   });
//   attendance.breaks = breaks;
//   attendance.breakIn = now;
//   attendance.breakOut = null;
//   return attendanceRepo.save(attendance);
// };

// export const endBreakService = async (
//   dbName: string,
//   staffId: number,
//   body: { remarks?: string } = {}
// ) => {
//   const ds = await getTenantConnection(dbName);
//   const attendanceRepo = ds.getRepository(StaffAttendance);

//   const today = getTodayDate();
//   const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

//   if (!attendance) throw new Error("No attendance record found for today");
//   if (attendance.clockOut) throw new Error("Already clocked out for today");

//   const breaks = (attendance.breaks || []) as BreakSession[];
//   const open = breaks.find((b) => !b.end);
//   if (!open) throw new Error("Not currently on break");

//   const now = new Date();
//   open.end = now;
//   if (body.remarks) open.remarks = body.remarks;
//   attendance.breaks = breaks;
//   attendance.breakOut = now;
//   attendance.breakIn = null;
//   attendance.breakDuration = calcBreakMinutes(breaks);
//   return attendanceRepo.save(attendance);
// };

// export const clockOutService = async (dbName: string, staffId: number, workSummary?: string) => {
//   const ds = await getTenantConnection(dbName);
//   const attendanceRepo = ds.getRepository(StaffAttendance);

//   const today = getTodayDate();
//   const attendance = await attendanceRepo.findOne({ where: { staffId, date: today } });

//   if (!attendance || !attendance.clockIn) throw new Error("No clock-in record found for today");
//   if (attendance.clockOut) throw new Error("Already clocked out for today");

//   const now = new Date();

//   // Auto-close any ongoing break.
//   const breaks = (attendance.breaks || []) as BreakSession[];
//   const open = breaks.find((b) => !b.end);
//   if (open) open.end = now;
//   attendance.breaks = breaks;
//   attendance.breakOut = now;
//   attendance.breakIn = null;
//   attendance.clockOut = now;
//   if (workSummary) {
//     attendance.notes = workSummary;
//   }

//   const settings = await loadSettings(ds);
//   const shift = attendance.shiftId
//     ? await ds.getRepository(Shift).findOne({ where: { id: attendance.shiftId } })
//     : await resolveActiveShift(ds, staffId, today);

//   const result = finalizeWorkingTime(attendance, shift, settings);
//   attendance.workingHours = result.workingHours;
//   attendance.breakDuration = result.breakDuration;
//   attendance.overtimeMinutes = result.overtimeMinutes;
//   attendance.earlyExitMinutes = result.earlyExitMinutes;
//   attendance.status = result.status;

//   if (settings.requireClockOutApproval) {
//     attendance.clockOutApproval = ClockOutApproval.PENDING;
//     await attendanceRepo.save(attendance);
//     // Raise a clock-out approval request for the admin queue.
//     const reqRepo = ds.getRepository(AttendanceRequest);
//     await reqRepo.save(
//       reqRepo.create({
//         employeeId: staffId,
//         requestType: AttendanceRequestType.CLOCK_OUT_APPROVAL,
//         requestDate: today,
//         reason: "Clock-out pending approval",
//         status: "Pending",
//         requestedBy: String(staffId),
//         payload: {
//           clockOut: now,
//           workingHours: result.workingHours,
//           status: result.status,
//         },
//       })
//     );
//     return attendance;
//   }
//   attendance.clockOutApproval = ClockOutApproval.AUTO;
//   return attendanceRepo.save(attendance);
// }; 

// export const getTodayAttendanceService = async (dbName: string, staffId: number) => {
//   const ds = await getTenantConnection(dbName);
//   const today = getTodayDate();
//   const attendance = await ds 
//     .getRepository(StaffAttendance)
//     .findOne({ where: { staffId, date: today } });

//   const shift = await resolveActiveShift(ds, staffId, today);
//   return { attendance, shift };
// };

// export const getAttendanceHistoryService = async (
//   dbName: string,
//   staffId: number,
//   startDate?: string,
//   endDate?: string
// ) => { 
//   const ds = await getTenantConnection(dbName);
//   const filter: any = { staffId };
//   if (startDate && endDate) filter.date = Between(startDate, endDate);

//   return ds.getRepository(StaffAttendance).find({
//     where: filter,
//     order: { date: "DESC" },
//   });
// };

// export const getStaffDashboardService = async (dbName: string, staffId: number) => {
//   const ds = await getTenantConnection(dbName);
//   const attRepo = ds.getRepository(StaffAttendance);
//   const today = getTodayDate();

//   const [todayRecord, shift, deptId, holidaysRaw] = await Promise.all([
//     attRepo.findOne({ where: { staffId, date: today } }),
//     resolveActiveShift(ds, staffId, today),
//     getStaffDepartmentId(ds, staffId),
//     ds.getRepository(Holiday).find({ where: { isActive: true } }),
//   ]);

//   // Weekly hours (last 7 days incl. today)
//   const weekStart = dayjs().subtract(6, "day").format("YYYY-MM-DD");
//   const weekRecords = await attRepo.find({
//     where: { staffId, date: Between(weekStart, today) },
//   });
//   const weekly: { name: string; value: number }[] = [];
//   for (let i = 6; i >= 0; i--) {
//     const d = dayjs().subtract(i, "day");
//     const dStr = d.format("YYYY-MM-DD");
//     const rec = weekRecords.find((r) => r.date === dStr);
//     weekly.push({ name: d.format("ddd"), value: rec ? Number(rec.workingHours) : 0 });
//   }

//   // Monthly summary 
//   const monthStart = dayjs().startOf("month").format("YYYY-MM-DD");
//   const monthEnd = dayjs().endOf("month").format("YYYY-MM-DD");
//   const monthRecords = await attRepo.find({
//     where: { staffId, date: Between(monthStart, monthEnd) },
//   });
//   const countBy = (s: string) => monthRecords.filter((r) => r.status === s).length;
//   const monthly = {
//     present: countBy(AttendanceStatus.PRESENT),
//     late: countBy(AttendanceStatus.LATE),
//     halfDay: countBy(AttendanceStatus.HALF_DAY),
//     absent: countBy(AttendanceStatus.ABSENT),
//     leave: countBy(AttendanceStatus.ON_LEAVE),
//     wfh: countBy(AttendanceStatus.WORK_FROM_HOME),
//     workedHours: Number(
//       monthRecords.reduce((s, r) => s + Number(r.workingHours || 0), 0).toFixed(2)
//     ),
//   };

//   // Upcoming holidays (next 60 days)
//   const upcomingHolidays = holidaysRaw
//     .filter((h) => {
//       if (h.departmentId && deptId && h.departmentId !== deptId) return false;
//       const hd = dayjs(h.holidayDate);
//       const eff = h.isRecurring ? hd.year(dayjs().year()) : hd;
//       return eff.isAfter(dayjs().subtract(1, "day")) && eff.isBefore(dayjs().add(60, "day"));
//     })
//     .sort((a, b) => dayjs(a.holidayDate).valueOf() - dayjs(b.holidayDate).valueOf())
//     .slice(0, 5)
//     .map((h) => ({
//       id: h.id,
//       holidayName: h.holidayName,
//       holidayDate: h.holidayDate,
//       holidayType: h.holidayType,
//     }));

//   // Pending requests
//   const pendingRequests = await ds.getRepository(AttendanceRequest).count({
//     where: { employeeId: staffId, status: "Pending" },
//   });

//   return {
//     today: todayRecord,
//     shift,
//     isHolidayToday: !!findHoliday(holidaysRaw, today, deptId),
//     isWeeklyOffToday: isWeeklyOff(shift, today),
//     weekly,
//     monthly,
//     upcomingHolidays,
//     pendingRequests,
//   };
// };


// export const createAttendanceRequestService = async (
//   dbName: string,
//   staffId: number,
//   data: any
// ) => {
//   const ds = await getTenantConnection(dbName);
//   const settings = await loadSettings(ds);

//   const type = data.requestType || AttendanceRequestType.REGULARIZATION;
//   if (!settings.allowRegularization && type !== AttendanceRequestType.SHIFT_CHANGE) {
//     throw new Error("Regularization requests are disabled by the company");
//   }
//   if (type === AttendanceRequestType.SHIFT_CHANGE && !settings.allowShiftChangeRequest) {
//     throw new Error("Shift change requests are disabled by the company");
//   }
//   if (!data.requestDate) throw new Error("Request date is required");
//   if (!data.reason) throw new Error("Reason is required");

//   const repo = ds.getRepository(AttendanceRequest);
//   const request = repo.create({
//     employeeId: staffId,
//     requestType: type,
//     requestDate: data.requestDate,
//     reason: data.reason,
//     status: "Pending",
//     requestedBy: String(staffId),
//     payload: data.payload || null,
//   });
//   return repo.save(request);
// };

// export const getMyRequestsService = async (dbName: string, staffId: number) => {
//   const ds = await getTenantConnection(dbName); 
//   return ds.getRepository(AttendanceRequest).find({
//     where: { employeeId: staffId },
//     order: { createdAt: "DESC" },
//   });
// };
 
// export const resetAttendanceService = async (dbName: string, staffId: number) => {
//   const ds = await getTenantConnection(dbName);
//   const today = getTodayDate();
//   await ds.getRepository(StaffAttendance).delete({ staffId, date: today });
// };


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
import { ShiftAssignment } from "../../entity/tenant/shiftAssignment.entity";
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

/*
 Get Holiday
*/
export const checkHolidayService = async (dbName: string, date: string) => {
  const ds = await getTenantConnection(dbName); 

  const repo = ds.getRepository(Holiday);

  return await repo.findOne({
    where: {
      holidayDate: date,
      isActive: true,
    },
  });
};

/*
 Get Employee Shift
*/
export const getStaffShiftService = async (dbName: string, staffId: number) => {
  const ds = await getTenantConnection(dbName);
console.log("DB:", dbName);
console.log("Staff:", staffId);
  const assignmentRepo = ds.getRepository(ShiftAssignment);

  const shiftRepo = ds.getRepository(Shift);

  const today = dayjs().format("YYYY-MM-DD");

  const assignment = await assignmentRepo
    .createQueryBuilder("sa")
    .where("sa.employeeId = :staffId", {
      staffId,
    })
    .andWhere("sa.status = :status", {
      status: "Active",
    })
    .andWhere("sa.effectiveFrom <= :today", {
      today,
    })
    .andWhere("(sa.effectiveTo IS NULL OR sa.effectiveTo >= :today)", {
      today,
    })
    .getOne();

  if (!assignment) {
    throw new Error("Shift not assigned");
  }

  const shift = await shiftRepo.findOne({
    where: {
      id: assignment.shiftId,
    },
  });

  if (!shift) {
    throw new Error("Shift not found");
  }

  return {
    assignment,
    shift,
  };
};

/*
 Check Weekly Off
*/
export const checkWeeklyOffService = (shift: Shift, date: string) => {
  const day = dayjs(date).format("dddd");

  if (shift.weeklyOff === day) {
    return true;
  }

  return false;
};

/*
 Clock In
*/
export const clockInService = async (dbName: string, data: any) => {
  const ds = await getTenantConnection(dbName);

  const repo = ds.getRepository(StaffAttendance);

  const today = dayjs().format("YYYY-MM-DD");

  let attendance = await repo.findOne({
    where: {
      staffId: data.staffId,
      date: today,
    },
  });

  if (attendance?.clockIn) {
    throw new Error("Already clocked in");
  }

  /*
 Holiday Check
*/

  const holiday = await checkHolidayService(dbName, today);

  if (holiday) {
    attendance = attendance ?? repo.create();

    attendance.staffId = data.staffId;

    attendance.date = today;

    attendance.status = AttendanceStatus.HOLIDAY;

    attendance.notes = holiday.holidayName;

    await repo.save(attendance);

    return attendance;
  }

  /*
 Shift Check
*/

  const { assignment, shift } = await getStaffShiftService(
    dbName,
    data.staffId,
  );

  /*
 Weekly Off Check
*/

  if (checkWeeklyOffService(shift, today)) {
    attendance = attendance ?? repo.create();

    attendance.staffId = data.staffId;

    attendance.date = today;

    attendance.status = AttendanceStatus.WEEKLY_OFF;

    attendance.shiftId = shift.id;

    attendance.shiftName = shift.shiftName;

    attendance.shiftAssignmentId = assignment.id;

    await repo.save(attendance);

    return attendance;
  }

  attendance = attendance ?? repo.create();

  attendance.staffId = data.staffId;

  attendance.date = today;

  attendance.clockIn = new Date();

  attendance.shiftId = shift.id;

  attendance.shiftName = shift.shiftName;

  attendance.shiftAssignmentId = assignment.id;

  attendance.status = AttendanceStatus.PRESENT;

  attendance.lateMinutes = calculateLateMinutes(
    attendance.clockIn,

    shift.startTime,

    shift.graceMinutes,
  );

  if (attendance.lateMinutes > 0) {
    attendance.status = AttendanceStatus.LATE;
  }

  attendance.device = data.device ?? null;

  attendance.browser = data.browser ?? null;

  attendance.ipAddress = data.ipAddress ?? null;

  attendance.location = data.location ?? null;

  await repo.save(attendance);

  return attendance;
};

/*
 Late Calculation
*/
export const calculateLateMinutes = (
  clockIn: Date,
  startTime: string,
  graceMinutes: number,
) => {
  const date = dayjs(clockIn).format("YYYY-MM-DD");

  const shiftStart = dayjs(`${date} ${startTime}`);

  let minutes = dayjs(clockIn).diff(shiftStart, "minute");

  minutes = minutes - graceMinutes;

  return minutes > 0 ? minutes : 0;
};

/*
 Clock Out
*/ 
export const clockOutService = async (dbName: string, data: any) => {
  const ds = await getTenantConnection(dbName);

  const repo = ds.getRepository(StaffAttendance);

  const today = dayjs().format("YYYY-MM-DD");

  const attendance = await repo.findOne({
    where: {
      staffId: data.staffId,
      date: today,
    },
  });

  if (!attendance) {
    throw new Error("Attendance not found");
  }

  if (!attendance.clockIn) {
    throw new Error("Please clock in first");
  }

  if (attendance.clockOut) {
    throw new Error("Already clocked out");
  }

  const { shift } = await getStaffShiftService(dbName, data.staffId);

  const now = new Date();

  attendance.clockOut = now;

  /*
   Working Hours
  */
  attendance.workingHours = calculateWorkingHours(
    attendance.clockIn,

    attendance.clockOut,

    attendance.breakDuration,
  );

  /*
    Early Exit
  */

  attendance.earlyExitMinutes = calculateEarlyExitMinutes(
    attendance.clockOut,

    shift.endTime,
  );

  /*
    Overtime
  */

  attendance.overtimeMinutes = calculateOvertimeMinutes(
    attendance.workingHours,

    Number(shift.overtimeAfterHours ?? shift.requiredHours),
  );

  /*
    Half Day / Absent Logic
  */

  if (attendance.workingHours < Number(shift.minWorkingHours)) {
    attendance.status = AttendanceStatus.HALF_DAY;
  }

  attendance.clockOutApproval = ClockOutApproval.AUTO;

  await repo.save(attendance);

  return attendance;
};

/*
 Calculate Working Hours
*/
export const calculateWorkingHours = (
  start: Date | null,
  end: Date | null,
  breakMinutes: number,
) => {
  if (!start || !end) return 0;

  const totalMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

  const workingMinutes = totalMinutes - breakMinutes;

  return Number((workingMinutes / 60).toFixed(2));
};

/*
 Early Exit Calculation
*/
export const calculateEarlyExitMinutes = (
  clockOut: Date,

  shiftEnd: string,
) => {
  const date = dayjs(clockOut).format("YYYY-MM-DD");

  const shiftEndTime = dayjs(`${date} ${shiftEnd}`);

  const minutes = shiftEndTime.diff(clockOut, "minute");

  return minutes > 0 ? minutes : 0;
};

/*
 Overtime Calculation
*/
export const calculateOvertimeMinutes = (
  workingHours: number,

  overtimeAfterHours: number,
) => {
  const overtime = workingHours - overtimeAfterHours;

  if (overtime <= 0) return 0;

  return Math.floor(overtime * 60);
};
 
/*
 Start Break
*/
export const startBreakService = async (dbName: string, data: any) => {
  const ds = await getTenantConnection(dbName);

  const repo = ds.getRepository(StaffAttendance);

  const today = dayjs().format("YYYY-MM-DD");

  const attendance = await repo.findOne({
    where: {
      staffId: data.staffId,
      date: today,
    },
  });

  if (!attendance) {
    throw new Error("Attendance not found");
  }

  if (attendance.breakIn) {
    throw new Error("Already in break");
  }

  const now = new Date();

  attendance.breakIn = now;

  const breaks = attendance.breaks ?? [];

  breaks.push({
    start: now,

    type: data.type ?? "Other",

    remarks: data.remarks ?? null,
  });

  attendance.breaks = breaks;

  await repo.save(attendance);

  return attendance;
};

/*
 End Break
*/
export const endBreakService = async (dbName: string, data: any) => {
  const ds = await getTenantConnection(dbName);

  const repo = ds.getRepository(StaffAttendance);

  const today = dayjs().format("YYYY-MM-DD");

  const attendance = await repo.findOne({
    where: {
      staffId: data.staffId,
      date: today,
    },
  });

  if (!attendance) {
    throw new Error("Attendance not found");
  }

  if (!attendance.breakIn) {
    throw new Error("No active break");
  }

  const now = new Date();

  attendance.breakOut = now;

  const breaks = attendance.breaks ?? [];

  const lastBreak = breaks[breaks.length - 1];

  if (lastBreak && !lastBreak.end) {
    lastBreak.end = now;

  const minutes = dayjs(now).diff(dayjs(lastBreak.start), "minute");
    attendance.breakDuration += minutes;
  }

  attendance.breakIn = null;

  await repo.save(attendance);

  return attendance;
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

// 2222 
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
