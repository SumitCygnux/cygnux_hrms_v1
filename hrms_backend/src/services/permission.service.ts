import { getTenantConnection } from "../connection/tenant.connection";
import { Permission } from "../entity/tenant/permissions.entity";

export const createPermissionService = async (
  dbName: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo = dataSource.getRepository(Permission);

  const existingPermission = await permissionRepo.findOne({
    where: {
      name: data.name,
    },
  });

  if (existingPermission) {
    throw new Error("Permission already exists");
  }

  const permission = permissionRepo.create({
    name: data.name,
    description: data.description,
  });

  return await permissionRepo.save(permission);
};

export const getPermissionsService = async (
  dbName: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo = dataSource.getRepository(Permission);

  return await permissionRepo.find({
    order: {
      name: "ASC",
    },
  });
};

export const updatePermissionService = async (
  dbName: string,
  id: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo = dataSource.getRepository(Permission);

  const permission = await permissionRepo.findOne({
    where: { id },
  });

  if (!permission) {
    throw new Error("Permission not found");
  }

  permission.name = data.name;
  permission.description = data.description;

  return await permissionRepo.save(permission);
};

export const deletePermissionService = async (
  dbName: string,
  id: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo = dataSource.getRepository(Permission);

  const permission = await permissionRepo.findOne({
    where: { id },
  });

  if (!permission) {
    throw new Error("Permission not found");
  }

  await permissionRepo.remove(permission);

  return {
    message: "Permission deleted successfully",
  };
};