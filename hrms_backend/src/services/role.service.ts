import { getTenantConnection } from "../connection/tenant.connection";
import { Role } from "../entity/tenant/roles.entity";

export const createRoleService = async (
  dbName: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);

  const existingRole = await roleRepo.findOne({
    where: {
      name: data.name,
    },
  });

  if (existingRole) {
    throw new Error("Role already exists");
  }

  const role = roleRepo.create({
    name: data.name,
    description: data.description,
  });

  return await roleRepo.save(role);
};

export const getRolesService = async (
  dbName: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);

  return await roleRepo.find({
    order: {
      name: "ASC",
    },
  });
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
