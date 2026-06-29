//   "SUPER_ADMIN",
//         "TENANT_ADMIN",
//         "EMPLOYEE",

import { DataSource } from "typeorm";
import { Role } from "../entity/tenant/roles.entity";

export const seedRoles = async (tenantDataSource: DataSource) => {
  const roleRepo = tenantDataSource.getRepository(Role);

  const defaultRoles = [
    {
      name: "SUPER_ADMIN",
      description: "Super Admin",
      is_system: true,
    },
    {
      name: "TENANT_ADMIN",
      description: "Tenant Admin",
      is_system: true,
    },
    {
      name: "HR",
      description: "HR Manager",
      is_system: true,
    },
    {
      name: "MANAGER",
      description: "Manager",
      is_system: true,
    },
    {
      name: "EMPLOYEE",
      description: "Employee",
      is_system: true,
    },
  ];

  for (const role of defaultRoles) {
    const exists = await roleRepo.findOne({
      where: {
        name: role.name,
      },
    });

    if (!exists) {
      await roleRepo.save(role);
    }
  }

  console.log("Default Roles Seeded");
};