import { getTenantConnection } from "../connection/tenant.connection";
import { RolePermission } from "../entity/tenant/rolePermission.entity";
import { Permission } from "../entity/tenant/permissions.entity";

export const saveRolePermissionsService = async (
  dbName: string,
  roleId: string,
  permissionIds: string[]
) => {

  const dataSource = await getTenantConnection(dbName);
  const repo =dataSource.getRepository(RolePermission);
  await repo.delete({ roleId });
  
  // const data = permissionIds.map(
  //   (permissionId) => ({
  //     roleId,
  //     permissionId,
  //   })
  // );
  // return await repo.save(data);

  
  // Save new permissions
  for (const permissionId of permissionIds) {
    await repo.save({
      roleId,
      permissionId,
    });
  }

  return {
    message: "Permissions assigned successfully",
  };
};



// export const getRolePermissionsService = async (
//   dbName: string,
//   roleId: string
// ) => {
//   const dataSource = await getTenantConnection(dbName);
//   const repo = dataSource.getRepository(RolePermission);
//   const alldata= await repo.find({
//     where: { roleId },
//   });

//   return alldata;
// };

export const getRolePermissionsService = async (
  dbName: string,
  roleId: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const rolePermissionRepo = dataSource.getRepository(RolePermission);
  const permissionRepo =  dataSource.getRepository(Permission);

  const rolePermissions = await rolePermissionRepo.find({
    where: { roleId },
  });

  const permissionIds = rolePermissions.map(
    (rp) => rp.permissionId
  );

  const permissions = await permissionRepo.find();

  return permissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    description: permission.description,
    assigned: permissionIds.includes(permission.id),
  }));
};