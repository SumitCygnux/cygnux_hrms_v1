import { getTenantConnection } from "../connection/tenant.connection";
import { Department } from "../entity/tenant/department.entity";
import { Designation } from "../entity/tenant/designation.entity";

export const createDepartmentService = async (dbName: string, payload: any) => {

    const dataSource = await getTenantConnection(dbName);
    const departmentRepo = dataSource.getRepository(Department);
    const department = await departmentRepo.save({
        name: payload.name,
        manager: payload.manager,
        budget: payload.budget,
        openPositions: payload.openPositions,
        headcount: 0
    });
    return department;
};

export const getDepartmentsService = async (dbName: string) => {
    const dataSource = await getTenantConnection(dbName);
    const departmentRepo = dataSource.getRepository(Department);
    return await departmentRepo.find({
        where: {
            is_deleted: false
        }
    });
};

export const updateDepartmentService = async (dbName: string, id: string, payload: any) => {
    const dataSource = await getTenantConnection(dbName);
    const departmentRepo = dataSource.getRepository(Department);

    const department = await departmentRepo.findOne({
        where: {
            id,
            is_deleted: false
        }
    });

    if (!department) {
        throw new Error("Department not found");
    }
    department.name = payload.name;
    department.manager = payload.manager;
    department.budget = payload.budget;
    department.openPositions = payload.openPositions;
    return await departmentRepo.save(department);
};

export const deleteDepartmentService = async (dbName: string, id: string) => {

    const dataSource = await getTenantConnection(dbName);
    const departmentRepo = dataSource.getRepository(Department);
    const designationRepo = dataSource.getRepository(Designation);
    const department = await departmentRepo.findOne({
        where: {
            id,
            is_deleted: false
        }
    });

    if (!department) {
        throw new Error("Department not found");
    }

    const designationCount =await designationRepo.count({
      where: {
        department_id: id,
        is_deleted: false
      }
    });
  if (designationCount > 0) {
    throw new Error("Department contains designations. Delete designations first.");
  }
    department.is_deleted = true;
    await departmentRepo.save(department);
    return true;
};