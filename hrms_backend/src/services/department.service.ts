import { getTenantConnection } from "../connection/tenant.connection";
import { Department } from "../entity/tenant/department.entity";

export const createDepartmentService =async (dbName:string,payload:any) => {

  const dataSource = await getTenantConnection(dbName);
  const departmentRepo = dataSource.getRepository(Department);
  const department = await departmentRepo.save({
    name: payload.name,
    manager:payload.manager,
    budget:payload.budget,
    openPositions:payload.openPositions,
    headcount:0
  });
  return department;
};

export const getDepartmentsService =async (dbName:string) => {
  const dataSource =await getTenantConnection(dbName);
  const departmentRepo = dataSource.getRepository(Department);
  return await departmentRepo.find({
    where:{
      is_deleted:false
    }
  });
};