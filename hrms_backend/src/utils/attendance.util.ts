import dayjs from "dayjs";
import { DataSource } from "typeorm";
import { Shift } from "../entity/tenant/shift.entity";
import { ShiftAssignment } from "../entity/tenant/shiftAssignment.entity";
import { Holiday } from "../entity/tenant/holiday.entity";
import {
  AttendanceStatus,
  BreakSession,
  StaffAttendance,
} from "../entity/tenant/staff/staff.attandance.entity";
// import { Shift } from "../entity/tenant/Shift.entity";
import { Staff } from "../entity/tenant/staff.entity";

// change kara Shift  mathi shift adding karu






// number ma convert kare na hoy to default value return
// const num = (v: any, fallback = 0): number => {
//   const n = Number(v);
//   return Number.isFinite(n) ? n : fallback;
// };

// // round of value 23.656 => 23.66
// const round2 = (n: number) => Math.round(n * 100) / 100;

// // 9:30  complete date  object banave che
// export const timeOnDate = (dateStr: string, hhmm: string): Date => {
//   const [h, m] = (hhmm || "00:00").split(":").map((x) => parseInt(x, 10));// minture like 9:30 ["9","30"]
//   const d = dayjs(dateStr).hour(h || 0).minute(m || 0).second(0).millisecond(0);
//   return d.toDate();
// };

// // start time givan date
// export const getShiftStart = (dateStr: string, shift: Shift): Date =>
//   timeOnDate(dateStr, shift.startTime);

// // jo shofy night ni hase to new day ma convert kari dese
// export const getShiftEnd = (dateStr: string, shift: Shift): Date => {
//   const start = timeOnDate(dateStr, shift.startTime);
//   let end = timeOnDate(dateStr, shift.endTime);
//   if (shift.crossMidnight || end.getTime() <= start.getTime()) {
//     end = dayjs(end).add(1, "day").toDate();
//   }
//   return end;
// };

// const ORDINAL: Record<string, number[]> = {
//   none: [],
//   all: [1, 2, 3, 4, 5],
//   "1st": [1],
//   "2nd": [2],
//   "3rd": [3],
//   "4th": [4],
//   "1st_3rd": [1, 3],
//   "2nd_4th": [2, 4],
//   "1st_4th": [1, 4],
// };

// /** Which occurrence (1st..5th) of its weekday a date is within its month. */
// const weekdayOccurrence = (d: dayjs.Dayjs): number => Math.ceil(d.date() / 7);
 
// /**
//  * Is the given date a weekly-off for this shift?
//  * Prefers explicit `weeklyOffDays` (day numbers 0..6); otherwise falls back to
//  * the legacy `weeklyOff` string + `saturdayPolicy` (alternate-Saturday) config.
//  */ 
// export const isWeeklyOff = (shift: Shift | null, dateStr: string): boolean => {
//   if (!shift) return false;
//   const d = dayjs(dateStr);
//   const dow = d.day();  // 0 = Sunday ... 6 = Saturday

//   if (Array.isArray(shift.weeklyOffDays) && shift.weeklyOffDays.length > 0) {
//     if (shift.weeklyOffDays.map(Number).includes(dow)) return true;
//   } else {
//     const off = (shift.weeklyOff || "").toLowerCase();
//     if (off === "sunday" && dow === 0) return true;
//     if (off === "saturday" && dow === 6) return true;
//   }

//   // Alternate-Saturday policy applies on Saturdays regardless of the above.
//   if (dow === 6) {
//     const occ = weekdayOccurrence(d);
//     const offWeeks = ORDINAL[shift.saturdayPolicy] || [];
//     if (offWeeks.includes(occ)) return true;
//   }

//   return false;
// };


// =======================================================
// Convert value to number.
// If value is not a valid number, return fallback value.
// =======================================================
const num = (value: any, fallback = 0): number => {
  const numberValue = Number(value);

  if (Number.isFinite(numberValue)) {
    return numberValue;
  }

  return fallback;
};

// =======================================================
// Round number to 2 decimal places.
// Example:
// 23.456 => 23.46
// =======================================================
const round2 = (value: number): number => {
  return Math.round(value * 100) / 100;
};

// =======================================================
// Create complete Date object from date and time.
// Example:
// date = 2026-08-03
// time = 09:30
// Result = 2026-08-03 09:30:00
// =======================================================
export const timeOnDate = (
  dateStr: string,
  hhmm: string
): Date => {

  // Split time into hours and minutes
  const timeParts = (hhmm || "00:00").split(":");

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  const date = dayjs(dateStr)
    .hour(hours || 0)
    .minute(minutes || 0)
    .second(0)
    .millisecond(0);

  return date.toDate();
};

// =======================================================
// Get shift start time.
// =======================================================
export const getShiftStart = (
  dateStr: string,
  shift: Shift
): Date => {

  return timeOnDate(dateStr, shift.startTime);
};

// =======================================================
// Get shift end time.
// If shift crosses midnight,
// move end time to next day.
// =======================================================
export const getShiftEnd = (
  dateStr: string,
  shift: Shift
): Date => {

  const shiftStart = timeOnDate(dateStr, shift.startTime);

  let shiftEnd = timeOnDate(dateStr, shift.endTime);

  const isNightShift = shift.crossMidnight;
  const endBeforeStart =
    shiftEnd.getTime() <= shiftStart.getTime();

  if (isNightShift || endBeforeStart) {
    shiftEnd = dayjs(shiftEnd)
      .add(1, "day")
      .toDate();
  }

  return shiftEnd;
};

// =======================================================
// Saturday policy
// =======================================================
const ORDINAL: Record<string, number[]> = {
  none: [],
  all: [1, 2, 3, 4, 5],
  "1st": [1],
  "2nd": [2],
  "3rd": [3],
  "4th": [4],
  "1st_3rd": [1, 3],
  "2nd_4th": [2, 4],
  "1st_4th": [1, 4],
};

// =======================================================
// Find which week of the month.
// Example:
// 5 Aug  -> 1st week
// 13 Aug -> 2nd week
// 27 Aug -> 4th week
// =======================================================
const weekdayOccurrence = (
  date: dayjs.Dayjs
): number => {

  return Math.ceil(date.date() / 7);
};

// =======================================================
// Check whether selected date is weekly off.
//
// First check weeklyOffDays.
// If not available, check old weeklyOff value.
//
// Saturday policy:
// 1st Saturday
// 2nd Saturday
// Alternate Saturday
// etc.
// =======================================================
export const isWeeklyOff = (
  shift: Shift | null,
  dateStr: string
): boolean => {

  if (!shift) {
    return false;
  }

  const currentDate = dayjs(dateStr);

  // Sunday = 0
  // Monday = 1
  // ...
  // Saturday = 6
  const dayNumber = currentDate.day();

  // ---------- Check weeklyOffDays ----------
  if (
    Array.isArray(shift.weeklyOffDays) &&
    shift.weeklyOffDays.length > 0
  ) {

    const weeklyOffDays = shift.weeklyOffDays.map(Number);

    if (weeklyOffDays.includes(dayNumber)) {
      return true;
    }

  } else {

    // ---------- Old weeklyOff ----------
    const weeklyOff = (shift.weeklyOff || "").toLowerCase();

    if (
      weeklyOff === "sunday" &&
      dayNumber === 0
    ) {
      return true;
    }

    if (
      weeklyOff === "saturday" &&
      dayNumber === 6
    ) {
      return true;
    }
  }

  // ---------- Saturday Policy ----------
  if (dayNumber === 6) {

    const currentWeek = weekdayOccurrence(currentDate);

    const saturdayOffWeeks =
      ORDINAL[shift.saturdayPolicy] || [];

    if (saturdayOffWeeks.includes(currentWeek)) {
      return true;
    }
  }

  return false;
};

// n2----------------------------------------------------------------------


// =======================================================
// Check whether given date is holiday.
// Also checks recurring holiday and department holiday.
// =======================================================
export const findHoliday = (
  holidays: Holiday[],
  dateStr: string, 
  departmentId?: string | null
): Holiday | null => { 
 
  const currentDate = dayjs(dateStr);

  for (const holiday of holidays) {

    // Skip inactive holiday
    if (!holiday.isActive) {
      continue;
    }

    // Check department holiday
    if (
      holiday.departmentId &&
      departmentId &&
      holiday.departmentId !== departmentId
    ) {
      continue;
    }

    const holidayDate = dayjs(holiday.holidayDate);

    const isSameDate = holidayDate.isSame(currentDate, "day");

    const isRecurringHoliday =
      holiday.isRecurring &&
      holidayDate.month() === currentDate.month() &&
      holidayDate.date() === currentDate.date();

    if (isSameDate || isRecurringHoliday) {
      return holiday;
    }
  }

  return null;
};


// =======================================================
// Find active shift assigned to employee.
// ======================================================= 

export const resolveActiveShift = async (
  ds: DataSource,
  staffId: number,
  dateStr: string
): Promise<Shift | null> => {

  const assignmentRepository =
    ds.getRepository(ShiftAssignment);

  const assignment = await assignmentRepository
    .createQueryBuilder("sa")
    .where("sa.employeeId = :staffId", { staffId })
    .andWhere("sa.status = :status", {
      status: "Active",
    })
    .andWhere("sa.effectiveFrom <= :date", {
      date: dateStr,
    })
    .andWhere(
      "(sa.effectiveTo IS NULL OR sa.effectiveTo >= :date)",
      {
        date: dateStr,
      }
    )
    .orderBy("sa.effectiveFrom", "DESC")
    .getOne();

  if (!assignment) {
    return null;
  }

  const shiftRepository = ds.getRepository(Shift);
  
  const shift = await shiftRepository.findOne({
    where: {
      id: assignment.shiftId,
    },
  });

  return shift;
};

// =======================================================
// Calculate total break duration in minutes.
// ======================================================= 

export const calcBreakMinutes = (
  breaks: BreakSession[] = []
): number => {

  let totalBreakMilliseconds = 0;

  for (const breakSession of breaks) {

    if (!breakSession.start || !breakSession.end) {
      continue;
    }

    const breakStart =
      new Date(breakSession.start).getTime();

    const breakEnd =
      new Date(breakSession.end).getTime();

    totalBreakMilliseconds +=
      breakEnd - breakStart;
  }

  const breakMinutes = Math.round(
    totalBreakMilliseconds / 60000
  );

  return Math.max(0, breakMinutes);
};

// =======================================================
// Check employee arrival.
// Present or Late.
// =======================================================
export const computeArrival = (
  shift: Shift | null,
  settings: Shift,
  clockIn: Date,
  dateStr: string
): {
  status: AttendanceStatus;
  lateMinutes: number;
} => {

  // No shift assigned
  if (!shift) {
    return {
      status: AttendanceStatus.PRESENT,
      lateMinutes: 0,
    };
  }
  // Shift start time
  const shiftStart =
    getShiftStart(dateStr, shift);

  // Grace period
  const graceMinutes =
    num(shift.graceMinutes) ||
    num(settings.graceMinutes);

  // Last allowed time
  const cutoffTime = dayjs(shiftStart)
    .add(graceMinutes, "minute")
    .toDate();

  // Employee arrived on time
  if (clockIn.getTime() <= cutoffTime.getTime()) {

    return {
      status: AttendanceStatus.PRESENT,
      lateMinutes: 0,
    };
  }

  // Calculate late minutes
  const difference =
    clockIn.getTime() -
    shiftStart.getTime();

  const lateMinutes = Math.max(
    0,
    Math.round(difference / 60000)
  );

  return {
    status: AttendanceStatus.LATE,
    lateMinutes,
  };
};



export interface FinalizeResult {
  workingHours: number;
  breakDuration: number;
  overtimeMinutes: number;
  earlyExitMinutes: number;
  status: AttendanceStatus;
}

// =======================================================
// Calculate working hours, overtime,
// early exit and final attendance status.
// =======================================================

export const finalizeWorkingTime = (
  record: Pick<
    StaffAttendance,
    "clockIn" | "clockOut" | "breaks" | "lateMinutes" | "status"
  >,
  shift: Shift | null,
  settings: Shift
): FinalizeResult => {

  // Convert clock in/out to Date object
  const clockIn = record.clockIn
    ? new Date(record.clockIn)
    : null;

  const clockOut = record.clockOut
    ? new Date(record.clockOut)
    : null;

  // Total break minutes
  const breakDuration = calcBreakMinutes(record.breaks);

  // Employee forgot clock-in or clock-out
  if (!clockIn || !clockOut) {
    return {
      workingHours: 0,
      breakDuration,
      overtimeMinutes: 0,
      earlyExitMinutes: 0,
      status: clockIn
        ? AttendanceStatus.MISSED_PUNCH
        : AttendanceStatus.ABSENT,
    };
  }

  // ===========================
  // Calculate Working Hours
  // ===========================

  const totalMilliseconds =

  clockOut.getTime() - clockIn.getTime();
  const totalTime = Math.max(0, totalMilliseconds);

  const workedMilliseconds =
    totalTime - breakDuration * 60000;

  const finalWorkedMilliseconds =
    Math.max(0, workedMilliseconds);

  const workingHours = round2(
    finalWorkedMilliseconds / 3600000
  );

  // ===========================
  // Calculate Overtime
  // ===========================

  let overtimeLimit = num(
    settings.overtimeAfterHours,
    8
  );

  if (
    shift &&
    shift.overtimeAfterHours != null
  ) {
    overtimeLimit = num(
      shift.overtimeAfterHours
    );
  }

  let overtimeMinutes = 0;

  if (workingHours > overtimeLimit) {

    const extraHours =
      workingHours - overtimeLimit;

    overtimeMinutes = Math.round(
      extraHours * 60
    );
  }

  // ===========================
  // Calculate Early Exit
  // ===========================

  let earlyExitMinutes = 0;

  if (shift) {

    const shiftDate =
      dayjs(clockIn).format("YYYY-MM-DD");

    const shiftEnd =
      getShiftEnd(shiftDate, shift);

    const difference =
      shiftEnd.getTime() -
      clockOut.getTime();

    const differenceMinutes =
      Math.round(difference / 60000);

    const allowedEarlyExit =
      num(shift.earlyExitMinutes);

    if (
      differenceMinutes > 0 &&
      differenceMinutes >= allowedEarlyExit
    ) {
      earlyExitMinutes =
        differenceMinutes;
    }
  }

  // ===========================
  // Calculate Final Status
  // ===========================

  let fullWorkingHours = num(
    settings.overtimeAfterHours,
    8
  );

  if (shift) {
    fullWorkingHours = num(
      shift.minWorkingHours,
      8
    );
  }

  const halfDayHours = num(
    settings.halfDayAfter,
    4
  );

  const employeeWasLate =
    record.status === AttendanceStatus.LATE ||
    num(record.lateMinutes) > 0;

  let status: AttendanceStatus;

  if (workingHours < halfDayHours) {

    status = AttendanceStatus.ABSENT;

  } else if (
    workingHours < fullWorkingHours
  ) {

    status = AttendanceStatus.HALF_DAY;

  } else {

    if (employeeWasLate) {
      status = AttendanceStatus.LATE;
    } else {
      status = AttendanceStatus.PRESENT;
    }
  }

  return {
    workingHours,
    breakDuration,
    overtimeMinutes,
    earlyExitMinutes,
    status,
  };
};


// =======================================================
// Find device type and browser from User-Agent
// =======================================================
export const parseDevice = (
  userAgent?: string
): { device: string; browser: string } => {

  const userAgentString = (userAgent || "").toLowerCase();

  // Default values
  let device = "Desktop";
  let browser = "Unknown";

  // ---------- Device ----------
  if (/mobile|iphone|android(?!.*tablet)/.test(userAgentString)) {
    device = "Mobile";
  } else if (/ipad|tablet/.test(userAgentString)) {
    device = "Tablet";
  }

  // ---------- Browser ----------
  if (userAgentString.includes("edg/")) {
    browser = "Edge";
  } else if (userAgentString.includes("chrome/")) {
    browser = "Chrome";
  } else if (userAgentString.includes("firefox/")) {
    browser = "Firefox";
  } else if (userAgentString.includes("safari/")) {
    browser = "Safari";
  }

  return {
    device,
    browser,
  };
};

// =======================================================
// Get client IP address
// =======================================================
export const getClientIp = (
  req: any
): string | null => {

  // Check forwarded IP
  const forwardedIp =
    req?.headers?.["x-forwarded-for"];

  if (
    typeof forwardedIp === "string" &&
    forwardedIp.length > 0
  ) {
    return forwardedIp
      .split(",")[0]
      .trim();
  }

  // Otherwise use request IP
  return (
    req?.ip ||
    req?.socket?.remoteAddress ||
    null
  );
};

// =======================================================
// Get department id of staff
// =======================================================
export const getStaffDepartmentId = async (
  ds: DataSource,
  staffId: number
): Promise<string | null> => {

  const staffRepository =
    ds.getRepository(Staff);

  const staff = await staffRepository.findOne({
    where: {
      id: staffId,
    },
  });

  if (!staff) {
    return null;
  }

  return staff.departmentId;
};

// =======================================================
// Check whether the day is
// Holiday or Weekly Off
// =======================================================
export const classifyNonWorkingDay = (
  shift: Shift | null,
  holiday: Holiday | null,
  dateStr: string
): AttendanceStatus | null => {

  // Holiday
  if (holiday) {
    return AttendanceStatus.HOLIDAY;
  }

  // Weekly Off
  const weeklyOff = isWeeklyOff(
    shift,
    dateStr
  );

  if (weeklyOff) {
    return AttendanceStatus.WEEKLY_OFF;
  }

  // Normal Working Day
  return null;
};






















// 222222222222222222222222222222--------------------------------------------------------------------------
/**
 * Find the holiday (if any) effective on `dateStr` for an optional department.
 * Honours department scoping and recurring (annual month/day) holidays.
 */


// export const findHoliday = (
//   holidays: Holiday[],
//   dateStr: string,
//   departmentId?: string | null
// ): Holiday | null => {
//   const d = dayjs(dateStr);
//   for (const h of holidays) {
//     if (!h.isActive) continue; 
//     if (h.departmentId && departmentId && h.departmentId !== departmentId) continue;
//     const hd = dayjs(h.holidayDate);
//     const sameDay = hd.isSame(d, "day");
//     const sameMonthDay = hd.month() === d.month() && hd.date() === d.date();
//     if (sameDay || (h.isRecurring && sameMonthDay)) return h;
//   }
//   return null;
// };

// /** Resolve the active shift assigned to a staff member on a given date. */

// export const resolveActiveShift = async (
//   ds: DataSource,
//   staffId: number,
//   dateStr: string
// ): Promise<Shift | null> => {
//   const assignment = await ds
//     .getRepository(ShiftAssignment)
//     .createQueryBuilder("sa")
//     .where("sa.employeeId = :staffId", { staffId })
//     .andWhere("sa.status = :status", { status: "Active" })
//     .andWhere("sa.effectiveFrom <= :date", { date: dateStr })
//     .andWhere("(sa.effectiveTo IS NULL OR sa.effectiveTo >= :date)", { date: dateStr })
//     .orderBy("sa.effectiveFrom", "DESC")
//     .getOne(); 

//   if (!assignment) return null;
//   return ds.getRepository(Shift).findOne({ where: { id: assignment.shiftId } });
// }; 

// /** Total completed-break minutes from the break sessions array. */
// export const calcBreakMinutes = (breaks: BreakSession[] = []): number => {
//   let ms = 0;
//   for (const b of breaks) {
//     if (b?.start && b?.end) {
//       ms += new Date(b.end).getTime() - new Date(b.start).getTime();
//     }
//   }
//   return Math.max(0, Math.round(ms / 60000));
// };

// // employee samai sar avyo che ke nai te find kare like late:
// export const computeArrival = (
//   shift: Shift | null,
//   settings: Shift,
//   clockIn: Date,
//   dateStr: string
// ): { status: AttendanceStatus;lateMinutes: number} => {
//   if (!shift) {
//     return { status: AttendanceStatus.PRESENT, lateMinutes: 0 };
//   }
//   const start = getShiftStart(dateStr, shift);
//   const grace = num(shift.graceMinutes) || num(settings.graceMinutes);
//   const cutoff = dayjs(start).add(grace, "minute").toDate();

//   if (clockIn.getTime() <= cutoff.getTime()) {
//     return { status: AttendanceStatus.PRESENT, lateMinutes: 0 };
//   }
//   const lateMinutes = Math.max(
//     0,
//     Math.round((clockIn.getTime() - start.getTime()) / 60000)
//   );
//   return { status: AttendanceStatus.LATE, lateMinutes };
// };

// export interface FinalizeResult {
//   workingHours: number;
//   breakDuration: number;
//   overtimeMinutes: number;
//   earlyExitMinutes: number;
//   status: AttendanceStatus;
// }

/**
 * Finalize a record once both clock-in and clock-out are known.
 * Computes worked hours (minus breaks), overtime, early-exit and final status.
 */ 

// export const finalizeWorkingTime = (
//   record: Pick<StaffAttendance, "clockIn" | "clockOut" | "breaks" | "lateMinutes" | "status">,
//   shift: Shift | null,
//   settings: Shift
// ): FinalizeResult => {
//   const clockIn = record.clockIn ? new Date(record.clockIn) : null;
//   const clockOut = record.clockOut ? new Date(record.clockOut) : null;

//   const breakDuration = calcBreakMinutes(record.breaks);

//   if (!clockIn || !clockOut) {
//     return {
//       workingHours: 0,
//       breakDuration,
//       overtimeMinutes: 0,
//       earlyExitMinutes: 0,
//       status: clockIn ? AttendanceStatus.MISSED_PUNCH : AttendanceStatus.ABSENT,
//     };
//   }

//   const totalMs = Math.max(0, clockOut.getTime() - clockIn.getTime());
//   const workedMs = Math.max(0, totalMs - breakDuration * 60000);
//   const workingHours = round2(workedMs / 3600000);

//   // Overtime
//   const otThreshold =
//     shift && shift.overtimeAfterHours != null
//       ? num(shift.overtimeAfterHours)
//       : num(settings.overtimeAfterHours, 8);
//   const overtimeMinutes =
//     workingHours > otThreshold ? Math.round((workingHours - otThreshold) * 60) : 0;

//   // Early exit
//   let earlyExitMinutes = 0;
//   if (shift) {
//     const end = getShiftEnd(record.clockIn ? dayjs(clockIn).format("YYYY-MM-DD") : "", shift);
//     const diffMin = Math.round((end.getTime() - clockOut.getTime()) / 60000);
//     if (diffMin > 0 && diffMin >= num(shift.earlyExitMinutes)) {
//       earlyExitMinutes = diffMin;
//     }
//   }

//   // Status
//   const full = shift ? num(shift.minWorkingHours, 8) : num(settings.overtimeAfterHours, 8);
//   const halfFloor = num(settings.halfDayAfter, 4);
//   const wasLate =
//     record.status === AttendanceStatus.LATE || num(record.lateMinutes) > 0;

//   let status: AttendanceStatus;
//   if (workingHours < halfFloor) {
//     status = AttendanceStatus.ABSENT;
//   } else if (workingHours < full) {
//     status = AttendanceStatus.HALF_DAY;
//   } else {
//     status = wasLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
//   }

//   return { workingHours, breakDuration, overtimeMinutes, earlyExitMinutes, status };
// };

/** Lightweight User-Agent sniff -> { device, browser }. */
// export const parseDevice = (
//   userAgent?: string
// ): { device: string; browser: string } => {
//   const ua = (userAgent || "").toLowerCase();
//   let device = "Desktop";
//   if (/mobile|iphone|android(?!.*tablet)/.test(ua)) device = "Mobile";
//   else if (/ipad|tablet/.test(ua)) device = "Tablet";

//   let browser = "Unknown";
//   if (ua.includes("edg/")) browser = "Edge";
//   else if (ua.includes("chrome/")) browser = "Chrome";
//   else if (ua.includes("firefox/")) browser = "Firefox";
//   else if (ua.includes("safari/")) browser = "Safari";

//   return { device, browser };
// };

// /** Best-effort client IP from an Express request. */
// export const getClientIp = (req: any): string | null => {
//   const fwd = req?.headers?.["x-forwarded-for"];
//   if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
//   return req?.ip || req?.socket?.remoteAddress || null;
// };

// /** Department id for a staff member (used for holiday scoping). */
// export const getStaffDepartmentId = async (
//   ds: DataSource,
//   staffId: number
// ): Promise<string | null> => {
//   const staff = await ds.getRepository(Staff).findOne({ where: { id: staffId } });
//   return staff?.departmentId ?? null;
// };

// /**
//  * Classify a day with no punches into Holiday / Weekly Off / (working day).
//  * Returns null when it's a normal working day (caller decides Absent etc.).
//  */

// export const classifyNonWorkingDay = (
//   shift: Shift | null,
//   holiday: Holiday | null,
//   dateStr: string
// ): AttendanceStatus | null => {
//   if (holiday) return AttendanceStatus.HOLIDAY;
//   if (isWeeklyOff(shift, dateStr)) return AttendanceStatus.WEEKLY_OFF;
//   return null;
// };



