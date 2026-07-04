import { getTenantConnection } from "../connection/tenant.connection";
import { Role } from "../entity/tenant/roles.entity";
import { Module } from "../entity/tenant/module.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const saveRolePermissionsService = async (
  dbName: string,
  roleId: string,
  permissions: any[]
) => {

  const dataSource = await getTenantConnection(dbName);

  const roleRepo = dataSource.getRepository(Role);
  const moduleRepo = dataSource.getRepository(Module);
  const rolePermissionRepo = dataSource.getRepository(RolePermission);

  const role = await roleRepo.findOne({
    where: { id: roleId },
  });

  if (!role) {
    throw new Error("Role not found");
  }

  // Delete old permissions
  await rolePermissionRepo.delete({
    role: {
      id: roleId,
    },
  });

  // for (const item of permissions) {

  //   const module = await moduleRepo.findOne({
  //     where: {
  //       id: item.moduleId,
  //     },
  //   });

  //   if (!module) continue;

  //   const permission = rolePermissionRepo.create({
  //     role,
  //     module,
  //     operations: item.operations,
  //     isActive: true,
  //   });

  //   await rolePermissionRepo.save(permission);
  // }

for (const item of permissions) {

  const ops = item.operations;

  const hasAnyPermission = Object.values(ops).some(
    (value) => value === true
  );

  if (!hasAnyPermission) {
    continue;
  }

  const module = await moduleRepo.findOne({
    where: {
      id: item.moduleId,
    },
  });

  if (!module) continue;

  const permission = rolePermissionRepo.create({
    role,
    module,
    operations: ops,
    isActive: true,
  });
console.log("Incoming Permissions:",permission);

  await rolePermissionRepo.save(permission);
}

  return {
    message: "Permissions Assigned Successfully",
  };
};

export const getRolePermissionsService = async (
  dbName: string,
  roleId: string
) => {

  const dataSource = await getTenantConnection(dbName);

  const repo = dataSource.getRepository(RolePermission);

  const permissions = await repo.find({
    where: {
      role: {
        id: roleId,
      },
    },
  });

  return permissions;
};