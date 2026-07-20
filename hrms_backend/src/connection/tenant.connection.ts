import { DataSource } from "typeorm";
import { Department } from "../entity/tenant/department.entity";
import { Designation }from "../entity/tenant/designation.entity";
import { Staff } from "../entity/tenant/staff.entity";
import { StaffAttendance } from "../entity/tenant/staff/staff.attandance.entity";
import { Role } from "../entity/tenant/roles.entity";

import { RolePermission } from "../entity/tenant/rolePermission.entity";
import { Leave } from "../entity/tenant/staff/staff.leave.entity";
import { Shift } from "../entity/tenant/shift.entity";
import { ShiftAssignment } from "../entity/tenant/shiftAssignment.entity";
import { AttendanceSettings } from "../entity/tenant/attendanceSettings.entity";
import { Holiday } from "../entity/tenant/holiday.entity";
import { AttendanceRequest } from "../entity/tenant/attendanceRequest.entity";
import { Payroll } from "../entity/tenant/payroll.entity";
import { Module } from "../entity/tenant/module.entity";
import { LeavePolicy } from "../entity/tenant/leavePolicy.entity";
import { Team } from "../entity/tenant/team.entity";

const tenantConnections = new Map<string, DataSource>();

export const getTenantConnection = async (dbName: string) => {

  if (tenantConnections.has(dbName)) {
    return tenantConnections.get(dbName)!;
  }

  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER || process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: dbName,
    synchronize: true,
    logging: false,
    entities: [
      Department,
      Designation,
      Staff,
      Role,
       Payroll,
       Module,
      RolePermission,
      Leave,
      Team,
      StaffAttendance,
      Shift,
      ShiftAssignment,
      AttendanceSettings,
      Holiday,
      AttendanceRequest,
      LeavePolicy
    ],
  });
 await dataSource.initialize();

  console.log(`${dbName} Connected`);
  tenantConnections.set(dbName, dataSource);
  return dataSource;
};