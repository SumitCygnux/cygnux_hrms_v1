import { getTenantConnection } from "../../connection/tenant.connection";
import {
  StaffAttendance,
  AttendanceStatus,
} from "../../entity/tenant/staff/staff.attandance.entity";
import { Staff } from "../../entity/tenant/staff.entity";
import { Department } from "../../entity/tenant/department.entity";
import { Designation } from "../../entity/tenant/designation.entity";
import { Shift } from "../../entity/tenant/shift.entity";
import { ShiftAssignment } from "../../entity/tenant/shiftAssignment.entity";
import { Holiday } from "../../entity/tenant/holiday.entity";
import dayjs from "dayjs";

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  date?: string;
  month?: string; // YYYY-MM
  departmentId?: string;
  shiftId?: string;
  employeeId?: string | number;
  status?: string;
}

const empCode = (id: number | string) => `EMP${String(id || "").padStart(4, "0")}`;

/** Joined attendance rows within a date range, with employee/dept/shift labels. */
const rangeRows = async (dbName: string, f: ReportFilters) => {
  const ds = await getTenantConnection(dbName);
  let qb = ds
    .getRepository(StaffAttendance)
    .createQueryBuilder("att")
    .leftJoin(Staff, "s", "s.id = att.staffId")
    .leftJoin(Department, "dept", "dept.id = s.departmentId")
    .leftJoin(Designation, "desig", "desig.id = s.designationId")
    .leftJoin(Shift, "shift", "shift.id::text = att.shiftId")
    .select("att.id", "id")
    .addSelect("att.date", "date")
    .addSelect("att.clockIn", "clockIn")
    .addSelect("att.clockOut", "clockOut")
    .addSelect("att.status", "status")
    .addSelect("att.workingHours", "workingHours")
    .addSelect("att.lateMinutes", "lateMinutes")
    .addSelect("att.earlyExitMinutes", "earlyExitMinutes")
    .addSelect("att.overtimeMinutes", "overtimeMinutes")
    .addSelect("att.breakDuration", "breakDuration")
    .addSelect("att.staffId", "staffId")
    .addSelect("s.fullName", "employeeName")
    .addSelect("dept.name", "departmentName")
    .addSelect("desig.title", "designationName")
    .addSelect("shift.shiftName", "shiftName")
    .where("1 = 1");

  if (f.date) qb = qb.andWhere("att.date = :date", { date: f.date });
  if (f.startDate) qb = qb.andWhere("att.date >= :start", { start: f.startDate });
  if (f.endDate) qb = qb.andWhere("att.date <= :end", { end: f.endDate });
  if (f.departmentId) qb = qb.andWhere("s.departmentId = :dep", { dep: f.departmentId });
  if (f.shiftId) qb = qb.andWhere("att.shiftId = :sid", { sid: f.shiftId });
  if (f.employeeId) qb = qb.andWhere("att.staffId = :eid", { eid: Number(f.employeeId) });
  if (f.status && f.status !== "All") qb = qb.andWhere("att.status = :st", { st: f.status });

  const rows = await qb.orderBy("att.date", "DESC").addOrderBy("s.fullName", "ASC").getRawMany();
  return rows.map((r) => ({ ...r, employeeCode: empCode(r.staffId) }));
};

const PRESENT_LIKE = [
  AttendanceStatus.PRESENT,
  AttendanceStatus.LATE,
  AttendanceStatus.HALF_DAY,
  AttendanceStatus.WORK_FROM_HOME,
  AttendanceStatus.ON_DUTY,
  AttendanceStatus.BUSINESS_TRIP,
];

const summarize = (rows: any[]) => {
  const count = (s: string) => rows.filter((r) => r.status === s).length;
  return {
    totalRecords: rows.length,
    present: count(AttendanceStatus.PRESENT),
    late: count(AttendanceStatus.LATE),
    halfDay: count(AttendanceStatus.HALF_DAY),
    absent: count(AttendanceStatus.ABSENT),
    leave: count(AttendanceStatus.ON_LEAVE),
    wfh: count(AttendanceStatus.WORK_FROM_HOME),
    holiday: count(AttendanceStatus.HOLIDAY),
    weeklyOff: count(AttendanceStatus.WEEKLY_OFF),
    missedPunch: count(AttendanceStatus.MISSED_PUNCH),
    totalWorkedHours: Number(
      rows.reduce((s, r) => s + Number(r.workingHours || 0), 0).toFixed(2)
    ),
    totalOvertimeMinutes: rows.reduce((s, r) => s + Number(r.overtimeMinutes || 0), 0),
    totalLateMinutes: rows.reduce((s, r) => s + Number(r.lateMinutes || 0), 0),
    totalBreakMinutes: rows.reduce((s, r) => s + Number(r.breakDuration || 0), 0),
  };
};

export const dailyReport = async (dbName: string, f: ReportFilters) => {
  const date = f.date || dayjs().format("YYYY-MM-DD");
  const rows = await rangeRows(dbName, { ...f, date });
  return { date, rows, summary: summarize(rows) };
};

export const monthlyReport = async (dbName: string, f: ReportFilters) => {
  const month = f.month || dayjs().format("YYYY-MM");
  const startDate = dayjs(`${month}-01`).startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs(`${month}-01`).endOf("month").format("YYYY-MM-DD");
  const rows = await rangeRows(dbName, { ...f, startDate, endDate });

  const byEmp = new Map<number, any>();
  for (const r of rows) {
    if (!byEmp.has(r.staffId)) {
      byEmp.set(r.staffId, {
        staffId: r.staffId,
        employeeCode: r.employeeCode,
        employeeName: r.employeeName,
        departmentName: r.departmentName,
        present: 0,
        late: 0,
        halfDay: 0,
        absent: 0,
        leave: 0,
        wfh: 0,
        holiday: 0,
        weeklyOff: 0,
        missedPunch: 0,
        workedHours: 0,
        overtimeMinutes: 0,
      });
    }
    const e = byEmp.get(r.staffId);
    if (r.status === AttendanceStatus.PRESENT) e.present++;
    else if (r.status === AttendanceStatus.LATE) e.late++;
    else if (r.status === AttendanceStatus.HALF_DAY) e.halfDay++;
    else if (r.status === AttendanceStatus.ABSENT) e.absent++;
    else if (r.status === AttendanceStatus.ON_LEAVE) e.leave++;
    else if (r.status === AttendanceStatus.WORK_FROM_HOME) e.wfh++;
    else if (r.status === AttendanceStatus.HOLIDAY) e.holiday++;
    else if (r.status === AttendanceStatus.WEEKLY_OFF) e.weeklyOff++;
    else if (r.status === AttendanceStatus.MISSED_PUNCH) e.missedPunch++;
    e.workedHours = Number((e.workedHours + Number(r.workingHours || 0)).toFixed(2));
    e.overtimeMinutes += Number(r.overtimeMinutes || 0);
  }
  return { month, rows: Array.from(byEmp.values()), summary: summarize(rows) };
};

export const employeeReport = async (dbName: string, f: ReportFilters) => {
  const rows = await rangeRows(dbName, f);
  return { rows, summary: summarize(rows) };
};

export const departmentReport = async (dbName: string, f: ReportFilters) => {
  const rows = await rangeRows(dbName, f);
  const byDept = new Map<string, any>();
  for (const r of rows) {
    const key = r.departmentName || "Unassigned";
    if (!byDept.has(key)) {
      byDept.set(key, {
        departmentName: key,
        records: 0,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        leave: 0,
        workedHours: 0,
      });
    }
    const d = byDept.get(key);
    d.records++;
    if (PRESENT_LIKE.includes(r.status)) d.present++;
    if (r.status === AttendanceStatus.ABSENT) d.absent++;
    if (r.status === AttendanceStatus.LATE) d.late++;
    if (r.status === AttendanceStatus.HALF_DAY) d.halfDay++;
    if (r.status === AttendanceStatus.ON_LEAVE) d.leave++;
    d.workedHours = Number((d.workedHours + Number(r.workingHours || 0)).toFixed(2));
  }
  const data = Array.from(byDept.values()).map((d) => ({
    ...d,
    attendanceRate: d.records > 0 ? Math.round((d.present / d.records) * 100) : 0,
  }));
  return { rows: data, summary: summarize(rows) };
};

export const lateReport = async (dbName: string, f: ReportFilters) => {
  const rows = (await rangeRows(dbName, f)).filter((r) => Number(r.lateMinutes) > 0);
  return { rows, summary: summarize(rows) };
};

export const overtimeReport = async (dbName: string, f: ReportFilters) => {
  const rows = (await rangeRows(dbName, f)).filter((r) => Number(r.overtimeMinutes) > 0);
  return { rows, summary: summarize(rows) };
};

export const breakReport = async (dbName: string, f: ReportFilters) => {
  const rows = (await rangeRows(dbName, f)).filter((r) => Number(r.breakDuration) > 0);
  return { rows, summary: summarize(rows) };
};

export const missedPunchReport = async (dbName: string, f: ReportFilters) => {
  const rows = (await rangeRows(dbName, { ...f, status: AttendanceStatus.MISSED_PUNCH }));
  return { rows, summary: summarize(rows) };
};

export const summaryReport = async (dbName: string, f: ReportFilters) => {
  const rows = await rangeRows(dbName, f);
  return { summary: summarize(rows) };
};

export const shiftReport = async (dbName: string) => {
  const ds = await getTenantConnection(dbName);
  const shifts = await ds.getRepository(Shift).find({ order: { shiftName: "ASC" } });
  const rows = [];
  for (const sh of shifts) {
    const assigned = await ds
      .getRepository(ShiftAssignment)
      .count({ where: { shiftId: sh.id, status: "Active" } });
    rows.push({
      shiftId: sh.id,
      shiftName: sh.shiftName,
      shiftCode: sh.shiftCode,
      shiftType: sh.shiftType,
      startTime: sh.startTime,
      endTime: sh.endTime,
      requiredHours: sh.requiredHours,
      weeklyOff: sh.weeklyOff,
      assignedEmployees: assigned,
      isActive: sh.isActive,
    });
  }
  return { rows };
};

export const holidayReport = async (dbName: string) => {
  const ds = await getTenantConnection(dbName);
  const holidays = await ds.getRepository(Holiday).find({ order: { holidayDate: "ASC" } });
  const departments = await ds.getRepository(Department).find();
  const deptMap = new Map(departments.map((d) => [d.id, d.name]));
  const rows = holidays.map((h) => ({
    id: h.id,
    holidayName: h.holidayName,
    holidayDate: h.holidayDate,
    holidayType: h.holidayType,
    branch: h.branch,
    department: h.departmentId ? deptMap.get(h.departmentId) || "—" : "All",
    isRecurring: h.isRecurring,
    isPaid: h.isPaid,
    isActive: h.isActive,
  }));
  return { rows };
};
