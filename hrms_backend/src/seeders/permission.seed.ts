import { Permission } from "../entity/tenant/permissions.entity";

export const seedPermissions = async (dataSource: any) => {
  const permissionRepo = dataSource.getRepository(Permission);

  const permissions = [
    "VIEW_PROFILE",
    "MARK_ATTENDANCE",
    "APPLY_LEAVE",
    "VIEW_TEAM",
    "APPROVE_LEAVE",
    "VIEW_EMPLOYEES",
    "MANAGE_EMPLOYEES",
    "MANAGE_DEPARTMENTS",
    "MANAGE_DESIGNATIONS",
  ];

  for (const permissionName of permissions) {
    const existing = await permissionRepo.findOne({
      where: { name: permissionName },
    });

    if (!existing) {
      await permissionRepo.save({
        name: permissionName,
      });
    }
  }

  console.log("Permissions Seeded Successfully");
};