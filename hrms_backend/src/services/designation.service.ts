import { getTenantConnection }from "../connection/tenant.connection";
import { Designation }from "../entity/tenant/designation.entity";

export const createDesignationService =async (dbName:string,payload:any) => {
  const dataSource = await getTenantConnection(dbName);
  const designationRepo =dataSource.getRepository(Designation);
  const designation =await designationRepo.save({
    title:payload.title,
    department_id:payload.department_id,
    baseSalary:payload.baseSalary
  });
  return designation;
};

export const getDesignationsService =async (dbName:string) => {
  const dataSource = await getTenantConnection(dbName);
  const designationRepo =dataSource.getRepository(Designation);
  return await designationRepo.find({
    where:{
      is_deleted:false
    }
  });
};