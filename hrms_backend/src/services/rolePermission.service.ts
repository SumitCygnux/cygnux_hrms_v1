import { getTenantConnection } from "../connection/tenant.connection";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const saveRolePermissionsService = async (
  dbName: string,
  roleId: string,
  permissionIds: string[]
) => {

  const dataSource = await getTenantConnection(dbName);
  const repo =dataSource.getRepository(RolePermission);
  await repo.delete({ roleId });
  
  const data = permissionIds.map(
    (permissionId) => ({
      roleId,
      permissionId,
    })
  );
  return await repo.save(data);
};

export const getRolePermissionsService = async (
  dbName: string,
  roleId: string
) => {
  const dataSource = await getTenantConnection(dbName);
  const repo = dataSource.getRepository(RolePermission);
  return await repo.find({
    where: { roleId },
  });
};

