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
import { AttendanceSettings } from "../entity/tenant/attendanceSettings.entity";
import { Staff } from "../entity/tenant/staff.entity";

/**
 * Attendance engine: single source of truth for all shift-aware calculations
 * (weekly-off / holiday detection, late / half-day / overtime, break math).
 *
 * Status model (intentionally simple and non-contradictory):
 *   full      = shift.minWorkingHours
 *   halfFloor = settings.halfDayAfterHours
 *     worked >= full                 -> Present (or Late when arrival was late)
 *     halfFloor <= worked < full     -> Half Day
 *     worked < halfFloor             -> Absent
 */

const num = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Parse "HH:mm" against a base date, returning a Date on that calendar day. */
export const timeOnDate = (dateStr: string, hhmm: string): Date => {
  const [h, m] = (hhmm || "00:00").split(":").map((x) => parseInt(x, 10));
  const d = dayjs(dateStr).hour(h || 0).minute(m || 0).second(0).millisecond(0);
  return d.toDate();
};

/** Shift start instant for a given date. */
export const getShiftStart = (dateStr: string, shift: Shift): Date =>
  timeOnDate(dateStr, shift.startTime);

/**
 * Shift end instant for a given date. Rolls to the next day when the shift
 * crosses midnight (explicit flag, or end time earlier than start time).
 */
export const getShiftEnd = (dateStr: string, shift: Shift): Date => {
  const start = timeOnDate(dateStr, shift.startTime);
  let end = timeOnDate(dateStr, shift.endTime);
  if (shift.crossMidnight || end.getTime() <= start.getTime()) {
    end = dayjs(end).add(1, "day").toDate();
  }
  return end;
};

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

/** Which occurrence (1st..5th) of its weekday a date is within its month. */
const weekdayOccurrence = (d: dayjs.Dayjs): number => Math.ceil(d.date() / 7);

/**
 * Is the given date a weekly-off for this shift?
 * Prefers explicit `weeklyOffDays` (day numbers 0..6); otherwise falls back to
 * the legacy `weeklyOff` string + `saturdayPolicy` (alternate-Saturday) config.
 */
export const isWeeklyOff = (shift: Shift | null, dateStr: string): boolean => {
  if (!shift) return false;
  const d = dayjs(dateStr);
  const dow = d.day(); // 0 = Sunday ... 6 = Saturday

  if (Array.isArray(shift.weeklyOffDays) && shift.weeklyOffDays.length > 0) {
    if (shift.weeklyOffDays.map(Number).includes(dow)) return true;
  } else {
    const off = (shift.weeklyOff || "").toLowerCase();
    if (off === "sunday" && dow === 0) return true;
    if (off === "saturday" && dow === 6) return true;
  }

  // Alternate-Saturday policy applies on Saturdays regardless of the above.
  if (dow === 6) {
    const occ = weekdayOccurrence(d);
    const offWeeks = ORDINAL[shift.saturdayPolicy] || [];
    if (offWeeks.includes(occ)) return true;
  }

  return false;
};

/**
 * Find the holiday (if any) effective on `dateStr` for an optional department.
 * Honours department scoping and recurring (annual month/day) holidays.
 */
export const findHoliday = (
  holidays: Holiday[],
  dateStr: string,
  departmentId?: string | null
): Holiday | null => {
  const d = dayjs(dateStr);
  for (const h of holidays) {
    if (!h.isActive) continue;
    if (h.departmentId && departmentId && h.departmentId !== departmentId) continue;
    const hd = dayjs(h.holidayDate);
    const sameDay = hd.isSame(d, "day");
    const sameMonthDay = hd.month() === d.month() && hd.date() === d.date();
    if (sameDay || (h.isRecurring && sameMonthDay)) return h;
  }
  return null;
};

/** Resolve the active shift assigned to a staff member on a given date. */
export const resolveActiveShift = async (
  ds: DataSource,
  staffId: number,
  dateStr: string
): Promise<Shift | null> => {
  const assignment = await ds
    .getRepository(ShiftAssignment)
    .createQueryBuilder("sa")
    .where("sa.employeeId = :staffId", { staffId })
    .andWhere("sa.status = :status", { status: "Active" })
    .andWhere("sa.effectiveFrom <= :date", { date: dateStr })
    .andWhere("(sa.effectiveTo IS NULL OR sa.effectiveTo >= :date)", { date: dateStr })
    .orderBy("sa.effectiveFrom", "DESC")
    .getOne();

  if (!assignment) return null;
  return ds.getRepository(Shift).findOne({ where: { id: assignment.shiftId } });
};

/** Total completed-break minutes from the break sessions array. */
export const calcBreakMinutes = (breaks: BreakSession[] = []): number => {
  let ms = 0;
  for (const b of breaks) {
    if (b?.start && b?.end) {
      ms += new Date(b.end).getTime() - new Date(b.start).getTime();
    }
  }
  return Math.max(0, Math.round(ms / 60000));
};

/** Arrival assessment at clock-in time: Present vs Late + late minutes. */
export const computeArrival = (
  shift: Shift | null,
  settings: AttendanceSettings,
  clockIn: Date,
  dateStr: string
): { status: AttendanceStatus; lateMinutes: number } => {
  if (!shift) {
    return { status: AttendanceStatus.PRESENT, lateMinutes: 0 };
  }
  const start = getShiftStart(dateStr, shift);
  const grace = num(shift.graceMinutes) || num(settings.lateAfterMinutes);
  const cutoff = dayjs(start).add(grace, "minute").toDate();

  if (clockIn.getTime() <= cutoff.getTime()) {
    return { status: AttendanceStatus.PRESENT, lateMinutes: 0 };
  }
  const lateMinutes = Math.max(
    0,
    Math.round((clockIn.getTime() - start.getTime()) / 60000)
  );
  return { status: AttendanceStatus.LATE, lateMinutes };
};

export interface FinalizeResult {
  workingHours: number;
  breakDuration: number;
  overtimeMinutes: number;
  earlyExitMinutes: number;
  status: AttendanceStatus;
}

/**
 * Finalize a record once both clock-in and clock-out are known.
 * Computes worked hours (minus breaks), overtime, early-exit and final status.
 */
export const finalizeWorkingTime = (
  record: Pick<StaffAttendance, "clockIn" | "clockOut" | "breaks" | "lateMinutes" | "status">,
  shift: Shift | null,
  settings: AttendanceSettings
): FinalizeResult => {
  const clockIn = record.clockIn ? new Date(record.clockIn) : null;
  const clockOut = record.clockOut ? new Date(record.clockOut) : null;

  const breakDuration = calcBreakMinutes(record.breaks);

  if (!clockIn || !clockOut) {
    return {
      workingHours: 0,
      breakDuration,
      overtimeMinutes: 0,
      earlyExitMinutes: 0,
      status: clockIn ? AttendanceStatus.MISSED_PUNCH : AttendanceStatus.ABSENT,
    };
  }

  const totalMs = Math.max(0, clockOut.getTime() - clockIn.getTime());
  const workedMs = Math.max(0, totalMs - breakDuration * 60000);
  const workingHours = round2(workedMs / 3600000);

  // Overtime
  const otThreshold =
    shift && shift.overtimeAfterHours != null
      ? num(shift.overtimeAfterHours)
      : num(settings.overtimeAfterHours, 8);
  const overtimeMinutes =
    workingHours > otThreshold ? Math.round((workingHours - otThreshold) * 60) : 0;

  // Early exit
  let earlyExitMinutes = 0;
  if (shift) {
    const end = getShiftEnd(record.clockIn ? dayjs(clockIn).format("YYYY-MM-DD") : "", shift);
    const diffMin = Math.round((end.getTime() - clockOut.getTime()) / 60000);
    if (diffMin > 0 && diffMin >= num(shift.earlyExitMinutes)) {
      earlyExitMinutes = diffMin;
    }
  }

  // Status
  const full = shift ? num(shift.minWorkingHours, 8) : num(settings.overtimeAfterHours, 8);
  const halfFloor = num(settings.halfDayAfterHours, 4);
  const wasLate =
    record.status === AttendanceStatus.LATE || num(record.lateMinutes) > 0;

  let status: AttendanceStatus;
  if (workingHours < halfFloor) {
    status = AttendanceStatus.ABSENT;
  } else if (workingHours < full) {
    status = AttendanceStatus.HALF_DAY;
  } else {
    status = wasLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
  }

  return { workingHours, breakDuration, overtimeMinutes, earlyExitMinutes, status };
};

/** Lightweight User-Agent sniff -> { device, browser }. */
export const parseDevice = (
  userAgent?: string
): { device: string; browser: string } => {
  const ua = (userAgent || "").toLowerCase();
  let device = "Desktop";
  if (/mobile|iphone|android(?!.*tablet)/.test(ua)) device = "Mobile";
  else if (/ipad|tablet/.test(ua)) device = "Tablet";

  let browser = "Unknown";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/")) browser = "Safari";

  return { device, browser };
};

/** Best-effort client IP from an Express request. */
export const getClientIp = (req: any): string | null => {
  const fwd = req?.headers?.["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req?.ip || req?.socket?.remoteAddress || null;
};

/** Department id for a staff member (used for holiday scoping). */
export const getStaffDepartmentId = async (
  ds: DataSource,
  staffId: number
): Promise<string | null> => {
  const staff = await ds.getRepository(Staff).findOne({ where: { id: staffId } });
  return staff?.departmentId ?? null;
};

/**
 * Classify a day with no punches into Holiday / Weekly Off / (working day).
 * Returns null when it's a normal working day (caller decides Absent etc.).
 */
export const classifyNonWorkingDay = (
  shift: Shift | null,
  holiday: Holiday | null,
  dateStr: string
): AttendanceStatus | null => {
  if (holiday) return AttendanceStatus.HOLIDAY;
  if (isWeeklyOff(shift, dateStr)) return AttendanceStatus.WEEKLY_OFF;
  return null;
};
