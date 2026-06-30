import { DataSource, IsNull, LessThan } from "typeorm";
import dayjs from "dayjs";
import DatabaseConnection from "../../connection/postgresql.connection";
import { getTenantConnection } from "../../connection/tenant.connection";
import { Tenant_dbs } from "../../entity/master/tenant_db.entity";
import {
  StaffAttendance,
  AttendanceStatus,
  ClockOutApproval,
} from "../../entity/tenant/staff/staff.attandance.entity";
import { AttendanceSettings } from "../../entity/tenant/attendanceSettings.entity";
import { Shift } from "../../entity/tenant/shift.entity";
import { Holiday } from "../../entity/tenant/holiday.entity";
import { Staff } from "../../entity/tenant/staff.entity";
import { Leave } from "../../entity/tenant/staff/staff.leave.entity";
import {
  resolveActiveShift,
  finalizeWorkingTime,
  getShiftEnd,
  findHoliday,
  isWeeklyOff,
} from "../../utils/attendance.util";

const loadSettings = async (ds: DataSource): Promise<AttendanceSettings> => {
  const repo = ds.getRepository(AttendanceSettings);
  let settings = await repo.findOne({ where: { id: 1 } });
  if (!settings) settings = await repo.save(repo.create({ id: 1 }));
  return settings;
};

/**
 * Finalize records from past days that were clocked-in but never clocked-out:
 *   - auto clock-out (shift end + buffer) when the shift/company allows it,
 *   - otherwise flag as Missed Punch.
 */
const finalizeOpenRecords = async (ds: DataSource, settings: AttendanceSettings) => {
  const today = dayjs().format("YYYY-MM-DD");
  const attRepo = ds.getRepository(StaffAttendance);

  const open = await attRepo.find({
    where: { date: LessThan(today), clockOut: IsNull() },
  });

  for (const rec of open) {
    if (!rec.clockIn) continue;
    const shift = rec.shiftId
      ? await ds.getRepository(Shift).findOne({ where: { id: rec.shiftId } })
      : await resolveActiveShift(ds, rec.staffId, rec.date);

    if (settings.autoClockOutEnabled && shift && shift.autoClockOut) {
      const end = getShiftEnd(rec.date, shift);
      rec.clockOut = dayjs(end).add(shift.autoClockOutAfterMinutes || 0, "minute").toDate();
      const result = finalizeWorkingTime(rec, shift, settings);
      rec.workingHours = result.workingHours;
      rec.breakDuration = result.breakDuration;
      rec.overtimeMinutes = result.overtimeMinutes;
      rec.earlyExitMinutes = result.earlyExitMinutes;
      rec.status = result.status;
      rec.clockOutApproval = ClockOutApproval.AUTO;
      rec.notes = (rec.notes ? rec.notes + " | " : "") + "Auto clock-out";
    } else {
      rec.status = AttendanceStatus.MISSED_PUNCH;
    }
    await attRepo.save(rec);
  }
};

/**
 * For yesterday, create marker rows for staff with no punch:
 *   Holiday / Weekly Off / On Leave / Absent (when auto-mark-absent is on).
 */
const markYesterday = async (ds: DataSource, settings: AttendanceSettings) => {
  const date = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  const attRepo = ds.getRepository(StaffAttendance);

  const [staffList, holidays, existing] = await Promise.all([
    ds.getRepository(Staff).find({ where: { status: "Active" } }),
    ds.getRepository(Holiday).find({ where: { isActive: true } }),
    attRepo.find({ where: { date } }),
  ]);
  const have = new Set(existing.map((r) => r.staffId));

  const leaves = await ds
    .getRepository(Leave)
    .createQueryBuilder("l")
    .where("l.status = :st", { st: "APPROVED" })
    .andWhere("l.fromDate <= :date AND l.toDate >= :date", { date })
    .getMany();
  const onLeaveIds = new Set(leaves.map((l) => l.staffId));

  for (const staff of staffList) {
    if (have.has(staff.id)) continue;
    const shift = await resolveActiveShift(ds, staff.id, date);

    let status: AttendanceStatus | null = null;
    if (findHoliday(holidays, date, staff.departmentId)) status = AttendanceStatus.HOLIDAY;
    else if (isWeeklyOff(shift, date)) status = AttendanceStatus.WEEKLY_OFF;
    else if (onLeaveIds.has(staff.id)) status = AttendanceStatus.ON_LEAVE;
    else if (settings.autoMarkAbsent) status = AttendanceStatus.ABSENT;

    if (!status) continue;

    await attRepo.save(
      attRepo.create({
        staffId: staff.id,
        date,
        status,
        shiftId: shift ? shift.id : null,
        breaks: [],
      })
    );
  }
};

/** Run the full maintenance pass for a single tenant database. */
export const runMaintenanceForTenant = async (dbName: string) => {
  const ds = await getTenantConnection(dbName);
  const settings = await loadSettings(ds);
  await finalizeOpenRecords(ds, settings);
  await markYesterday(ds, settings);
};

/** Run maintenance across every active tenant (used by the scheduled sweeper). */
export const runMaintenanceAllTenants = async () => {
  if (!DatabaseConnection.isInitialized) return;
  const tenants = await DatabaseConnection.getRepository(Tenant_dbs).find({
    where: { is_active: true },
  });
  for (const t of tenants) {
    try {
      await runMaintenanceForTenant(t.db_name);
    } catch (e) {
      console.error(`Attendance maintenance failed for ${t.db_name}:`, e);
    }
  }
};
