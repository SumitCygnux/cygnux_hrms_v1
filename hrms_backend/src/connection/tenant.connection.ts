import { DataSource } from "typeorm";
import { Department } from "../entity/tenant/department.entity";
import { Designation }from "../entity/tenant/designation.entity";
import { Staff } from "../entity/tenant/staff.entity";
import { StaffAttendance } from "../entity/tenant/staff/staff.attandance.entity";
import { Leave } from "../entity/tenant/staff/staff.leave.entity";
const tenantConnections = new Map<string, DataSource>();

export const getTenantConnection = async (dbName: string) => {

  if (tenantConnections.has(dbName)) {
    return tenantConnections.get(dbName)!;
  }

  const dataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: dbName,
    synchronize: true,
    logging: false,
    entities: [
      Department,
      Designation,
      Staff
    ],
  });

 await dataSource.initialize();

  console.log(`${dbName} Connected`);
  console.log("Staff Entity Loaded");

  tenantConnections.set(dbName, dataSource);

  return dataSource;
};