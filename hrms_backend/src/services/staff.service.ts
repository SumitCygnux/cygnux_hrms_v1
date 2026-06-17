import { getTenantConnection } from "../connection/tenant.connection";
import { Staff } from "../entity/tenant/staff.entity";

export const createStaffService = async (dbName: string,data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);

 
  
  console.log("FINAL DATA:", data);
  console.log("departmentId:", data.departmentId);
  console.log("designationId:", data.designationId);


  const staff = staffRepo.create({
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    departmentId: data.departmentId,
    designationId: data.designationId,
    salary: data.salary,
    dob: data.dob,
    joiningDate: data.joiningDate,
    address: data.address,
  });

  return await staffRepo.save(staff);

};

export const getAllStaffService = async (
  dbName: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const staffRepo = dataSource.getRepository(Staff);

  return await staffRepo.find();
};