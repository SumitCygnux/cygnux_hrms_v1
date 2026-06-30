import { DataSource } from "typeorm";
import { Role } from "../entity/tenant/roles.entity";
import { Permission } from "../entity/tenant/permissions.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const seedRolePermissions = async (
  tenantDataSource: DataSource
) => {
  const roleRepo = tenantDataSource.getRepository(Role);
  const permissionRepo = tenantDataSource.getRepository(Permission);
  const rolePermissionRepo = tenantDataSource.getRepository(RolePermission);

  const roles = await roleRepo.find();
  const permissions = await permissionRepo.find();

  for (const role of roles) {

    let assignedPermissions: Permission[] = [];

   switch (role.name) {
    
  case "SUPER_ADMIN":
    assignedPermissions = permissions;
    break;

  case "TENANT_ADMIN":
    assignedPermissions = permissions.filter((p) =>
      [
 
        "role.create",
        "role.view",
        "role.update",
        "role.delete",

     
        "staff.create",
        "staff.view",
        "staff.update",
        "staff.delete",

       
        "department.create",
        "department.view",
        "department.update",
        "department.delete",

        "designation.create",
        "designation.view",
        "designation.update",
        "designation.delete",

     
        "attendance.create",
        "attendance.view",
        "attendance.update",
        "attendance.delete",

     
        "leave.create",
        "leave.view",
        "leave.update",
        "leave.delete",
        "leave.approve",

    
        "profile.view",
        "profile.update",
      ].includes(p.name)
    );
    break;

  case "HR":
    assignedPermissions = permissions.filter((p) =>
      [
        "staff.create",
        "staff.view",
        "staff.update",

        "attendance.create",
        "attendance.view",

        "leave.view",
        "leave.approve",

        "profile.view",
        "profile.update",
      ].includes(p.name)
    );
    break;

  case "MANAGER":
    assignedPermissions = permissions.filter((p) =>
      [
        "staff.view",

        "attendance.view",

        "leave.view",
        "leave.approve",

        "profile.view",
      ].includes(p.name)
    );
    break;

  case "EMPLOYEE":
    assignedPermissions = permissions.filter((p) =>
      [
        "profile.view",
        "profile.update",

        "attendance.view",

        "leave.create",
        "leave.view",
      ].includes(p.name)
    );
    break;
}

    for (const permission of assignedPermissions) {

      const exists = await rolePermissionRepo.findOne({
        where: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      if (!exists) {
        await rolePermissionRepo.save({
          roleId: role.id,
          permissionId: permission.id,
        });
      }
    }
  }

  console.log("Role Permissions Seeded");
};