import { getTenantConnection } from "../connection/tenant.connection";
import { Payroll } from "../entity/tenant/payroll.entity";
import { Staff } from "../entity/tenant/staff.entity";
import { Department } from "../entity/tenant/department.entity";
import { Designation } from "../entity/tenant/designation.entity";


export const createPayrollService = async (
  dbName: string,
  data: any
) => {

  const dataSource = await getTenantConnection(dbName);

  const payrollRepo = dataSource.getRepository(Payroll);
  const staffRepo = dataSource.getRepository(Staff);

  const staff = await staffRepo.findOne({
    where: {
      id: Number(data.staffId),
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  const payroll = payrollRepo.create({
    staffId: staff.id,
    basicSalary: Number(staff.salary),
    allowance: 0,
    bonus: 0,
    deduction: 0,
    tax: 0,
    netSalary: Number(staff.salary),
    month: data.month,
    year: data.year,
    status: "Pending",
  });

  return await payrollRepo.save(payroll);
};



export const getAllPayrollService = async (
  dbName: string
) => {

  const dataSource = await getTenantConnection(dbName);

  const payrollRepo = dataSource.getRepository(Payroll);

  return await payrollRepo.find({
    relations: {
      staff: true,
    },
    order: {
      id: "DESC",
    },
  });

};



export const getPayrollByIdService = async (
  dbName: string,
  id: number
) => {

  const dataSource = await getTenantConnection(dbName);

  const payrollRepo = dataSource.getRepository(Payroll);

  return await payrollRepo.findOne({
    where: {
      id,
    },
    relations: {
      staff: true,
    },
  });

};



export const updatePayrollService = async (
  dbName: string,
  id: number,
  data: any
) => {

  const dataSource = await getTenantConnection(dbName);

  const payrollRepo = dataSource.getRepository(Payroll);

  const payroll = await payrollRepo.findOne({
    where: {
      id,
    },
  });

  if (!payroll) {
    throw new Error("Payroll not found");
  }

  payroll.allowance = Number(data.allowance || 0);

  payroll.bonus = Number(data.bonus || 0);

  payroll.deduction = Number(data.deduction || 0);

  payroll.tax = Number(data.tax || 0);

  payroll.netSalary =
    Number(payroll.basicSalary) +
    Number(payroll.allowance) +
    Number(payroll.bonus) -
    Number(payroll.deduction) -
    Number(payroll.tax);

  return await payrollRepo.save(payroll);

};


export const processPayrollService = async (
  dbName: string,
  id: number
) => {

  const dataSource = await getTenantConnection(dbName);

  const payrollRepo = dataSource.getRepository(Payroll);

  const payroll = await payrollRepo.findOne({
    where: {
      id,
    },
  });

  if (!payroll) {
    throw new Error("Payroll not found");
  }

  payroll.status = "Processed";

  payroll.processedAt = new Date();

  return await payrollRepo.save(payroll);

};