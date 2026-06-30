import { DataSource } from "typeorm";
import { Permission } from "../entity/tenant/permissions.entity";

export const seedPermissions = async (
  tenantDataSource: DataSource
) => {
  const permissionRepo =
    tenantDataSource.getRepository(Permission);

 const defaultPermissions = [

  {
    name: "role.create",
    description: "Create Role",
  },
  {
    name: "role.view",
    description: "View Role",
  },
  {
    name: "role.update",
    description: "Update Role",
  },
  {
    name: "role.delete",
    description: "Delete Role",
  },

  {
    name: "staff.create",
    description: "Create Staff",
  },
  {
    name: "staff.view",
    description: "View Staff",
  },
  {
    name: "staff.update",
    description: "Update Staff",
  },
  {
    name: "staff.delete",
    description: "Delete Staff",
  },

  {
    name: "department.create",
    description: "Create Department",
  },
  {
    name: "department.view",
    description: "View Department",
  },
  {
    name: "department.update",
    description: "Update Department",
  },
  {
    name: "department.delete",
    description: "Delete Department",
  },


  {
    name: "designation.create",
    description: "Create Designation",
  },
  {
    name: "designation.view",
    description: "View Designation",
  },
  {
    name: "designation.update",
    description: "Update Designation",
  },
  {
    name: "designation.delete",
    description: "Delete Designation",
  },

  {
    name: "attendance.create",
    description: "Create Attendance",
  },
  {
    name: "attendance.view",
    description: "View Attendance",
  },
  {
    name: "attendance.update",
    description: "Update Attendance",
  },
  {
    name: "attendance.delete",
    description: "Delete Attendance",
  },

  
  {
    name: "leave.create",
    description: "Create Leave",
  },
  {
    name: "leave.view",
    description: "View Leave",
  },
  {
    name: "leave.update",
    description: "Update Leave",
  },
  {
    name: "leave.delete",
    description: "Delete Leave",
  },
  {
    name: "leave.approve",
    description: "Approve Leave",
  },

 
  {
    name: "profile.view",
    description: "View Profile",
  },
  {
    name: "profile.update",
    description: "Update Profile",
  },
];

  for (const permission of defaultPermissions) {
    const exists = await permissionRepo.findOne({
      where: {
        name: permission.name,
      },
    });

    if (!exists) {
      await permissionRepo.save(permission);
    }
  }

  console.log("Permissions Seeded");
};