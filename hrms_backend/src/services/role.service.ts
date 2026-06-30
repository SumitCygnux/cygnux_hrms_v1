import { getTenantConnection } from "../connection/tenant.connection";
import { Role } from "../entity/tenant/roles.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const createRoleService = async (
  dbName: string,
  payload: any
) => {

  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);

  const exists = await roleRepo.findOne({
    where: {
      name: payload.name,
    },
  });

  if (exists) {
    throw new Error("Role already exists");
  }

  const role = await roleRepo.save({
    name: payload.name,
    description: payload.description,
    is_system: false,
  });

  return role;
};

export const getAllRolesService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);

  const roles = await roleRepo.find({
    where: {
      is_deleted: false,
    },
    order: {
      created_at: "ASC",
    },
  });

  return roles;
};

export const updateRoleService = async (
  dbName: string,
  id: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);

  const role = await roleRepo.findOne({
    where: {
      id,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  role.name = data.name;
  role.description = data.description;

  return await roleRepo.save(role);
};

// permission asssign
