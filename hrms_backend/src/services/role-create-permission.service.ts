import { getTenantConnection } from "../connection/tenant.connection";
import { RoleCreatePermission } from "../entity/tenant/role-create-permission.entity.ts";
import { Role } from "../entity/tenant/roles.entity";

export const createRoleCreatePermissionService = async (
  dbName: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);
  const permissionRepo = dataSource.getRepository(RoleCreatePermission);
  const roleRepo = dataSource.getRepository(Role);

  const role = await roleRepo.findOne({
    where: {
      id: data.roleId,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  const allowedRole = await roleRepo.findOne({
    where: {
      id: data.allowedRoleId,
    },
  });

  if (!allowedRole) {
    throw new Error("Allowed role not found");
  }

  const exists = await permissionRepo.findOne({
    where: {
      roleId: data.roleId,
      allowedRoleId: data.allowedRoleId,
    },
  });

  if (exists) {
    throw new Error("Permission already exists");
  }

  const permission = permissionRepo.create(data);

  return await permissionRepo.save(permission);
};

// Get All
export const getRoleCreatePermissionService = async (
  dbName: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo =
    dataSource.getRepository(RoleCreatePermission);

  return await permissionRepo.find({
    relations: {
      role: true,
      allowedRole: true,
    },
  });
};

// Get Allowed Roles
export const getAllowedRolesService = async (
  dbName: string,
  roleId: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo =
    dataSource.getRepository(RoleCreatePermission);

  const permissions = await permissionRepo.find({
    where: {
      roleId,
    },
    relations: {
      allowedRole: true,
    },
  });

  return permissions.map((item) => item.allowedRole);
};

// Delete
export const deleteRoleCreatePermissionService = async (
  dbName: string,
  id: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo =
    dataSource.getRepository(RoleCreatePermission);

  const permission = await permissionRepo.findOne({
    where: {
      id,
    },
  });

  if (!permission) {
    throw new Error("Permission not found");
  }

  await permissionRepo.remove(permission);

  return {
    message: "Permission deleted successfully",
  };
};

export const updateRoleCreatePermissionService = async (
  dbName: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const permissionRepo =
    dataSource.getRepository(RoleCreatePermission);

  const roleRepo =
    dataSource.getRepository(Role);

  
  const role = await roleRepo.findOne({
    where: {
      id: data.roleId,
    },
  });

  if (!role) {
    throw new Error("Role not found");
  }


  await permissionRepo.delete({
    roleId: data.roleId,
  });


  for (const allowedRoleId of data.allowedRoles) {

    const allowedRole = await roleRepo.findOne({
      where: {
        id: allowedRoleId,
      },
    });

    if (!allowedRole) continue;

    await permissionRepo.save({
      roleId: data.roleId,
      allowedRoleId,
    });
  }

  return await permissionRepo.find({
    where: {
      roleId: data.roleId,
    },
    relations: {
      role: true,
      allowedRole: true,
    },
  });
};
