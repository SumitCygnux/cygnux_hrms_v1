import { DataSource } from "typeorm";
import { Role } from "../entity/tenant/roles.entity";
import { RoleCreatePermission } from "../entity/tenant/role-create-permission.entity.ts";

export const seedRoleCreatePermission = async (dataSource: DataSource) => {
  const roleRepo = dataSource.getRepository(Role);
  const permissionRepo = dataSource.getRepository(RoleCreatePermission);

  const roles = await roleRepo.find();

  const superAdmin = roles.find((r) => r.name === "SUPER_ADMIN");

  const tenantAdmin = roles.find((r) => r.name === "TENANT_ADMIN");

  const hr = roles.find((r) => r.name === "HR");

  const manager = roles.find((r) => r.name === "MANAGER");

  const employee = roles.find((r) => r.name === "EMPLOYEE");

  const data = [
    {
      roleId: superAdmin?.id,
      allowedRoleId: tenantAdmin?.id,
    },
    {
      roleId: tenantAdmin?.id,
      allowedRoleId: hr?.id,
    },
    {
      roleId: tenantAdmin?.id,
      allowedRoleId: manager?.id,
    },
    {
      roleId: hr?.id,
      allowedRoleId: employee?.id,
    },
  ];
  
  for (const item of data) {
    if (!item.roleId || !item.allowedRoleId) continue;

    const exists = await permissionRepo.findOne({
      where: {
        roleId: item.roleId,
        allowedRoleId: item.allowedRoleId,
      },
    });

    if (!exists) {
      await permissionRepo.save(permissionRepo.create(item));
    }
  }

  console.log("Role Create Permission Seeded");
};
