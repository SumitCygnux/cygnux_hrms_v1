import { getTenantConnection } from "../connection/tenant.connection";
import { Staff } from "../entity/tenant/staff.entity";
import { Leave } from "../entity/tenant/staff/staff.leave.entity";
import { Department } from "../entity/tenant/department.entity";
import { Designation } from "../entity/tenant/designation.entity";
export const createStaffService = async (dbName: string, data: any) => {
  const dataSource = await getTenantConnection(dbName);
  const staffRepo = dataSource.getRepository(Staff);

  const staff = staffRepo.create({
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    phone: data.phone,
    password: data.password,
    gender: data.gender,
    departmentId: data.departmentId,
    designationId: data.designationId,
    salary: data.salary,
    dob: data.dob,
    joiningDate: data.joiningDate,
    address: data.address,
    accessRoleId: data.accessRoleId,
  });

  const savedStaff = await staffRepo.save(staff);
  return savedStaff;
};

export const getAllStaffService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);

  return await staffRepo.find();
};

export const updateStaffStatusService = async (
  dbName: string,
  id: number,
  status: string,
) => {
  const dataSource = await getTenantConnection(dbName);
  const staffRepo = dataSource.getRepository(Staff);
  const staff = await staffRepo.findOne({
    where: { id },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  staff.status = status;

  return await staffRepo.save(staff);
};

export const setupPasswordService = async (
  dbName: string,
  staffId: number,
  newPassword: string,
) => {
  const dataSource = await getTenantConnection(dbName);
  const staffRepo = dataSource.getRepository(Staff);

  const staff = await staffRepo.findOne({ where: { id: staffId } });
  if (!staff) throw new Error("Staff not found");

  staff.password = newPassword;
  staff.status = "Active";
  return await staffRepo.save(staff);
};

export const getStaffByIdService = async (dbName: string, id: number) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);
  const departmentRepo = dataSource.getRepository(Department);
  const designationRepo = dataSource.getRepository(Designation);

  const staff = await staffRepo.findOne({
    where: { id: Number(id) },
  });

  if (!staff) {
    return null;
  }

  const department = await departmentRepo.findOne({
    where: {
      id: staff.departmentId,
    },
  });

  const designation = await designationRepo.findOne({
    where: {
      id: staff.designationId,
    },
  });

  return {
    ...staff,

    departmentName: department?.name || "",

    designationName: designation?.title || "",

   
  };
};

export const updateStaffService = async (
  dbName: string,
  id: Number,
  data: any,
) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);
  const staff = await staffRepo.findOne({
    where: { id: Number(id) },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  Object.assign(staff, {
    ...data,
  });

  const updatedStaff = await staffRepo.save(staff);

  return updatedStaff;
};

export const getAllLeaveService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const leaveRepo = dataSource.getRepository(Leave);

  const leaves = await leaveRepo.find({
    order: {
      createdAt: "DESC",
    },
  });

  return leaves;
};

export const updateLeaveStatusService = async (
  dbName: string,
  leaveId: number,
  status: string,
  role: string
) => {
  const dataSource = await getTenantConnection(dbName);
  const leaveRepo = dataSource.getRepository(Leave);

  const leave = await leaveRepo.findOne({
    where: { id: leaveId },
  });

  if (!leave) {
    throw new Error("Leave request not found");
  }

  if(leave.approverRole !== role){
    throw new Error(
      "You are not allowed to approve this leave"
    );
  }

  leave.status = status.toUpperCase();
  
  return await leaveRepo.save(leave);
};
