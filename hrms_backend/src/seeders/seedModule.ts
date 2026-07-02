import { DataSource } from "typeorm";
import { Module } from "../entity/tenant/module.entity";

export const seedModules = async (
  tenantDataSource: DataSource
) => {

  const moduleRepo =
    tenantDataSource.getRepository(Module);

  const modules = [

    {
      name: "Dashboard",
      identifier: "dashboard",
      description: "Dashboard Module",
      icon: "MdDashboard",
      path: "/dashboard",
      sortOrder: 1,
    },

    {
      name: "Staff Management",
      identifier: "staff",
      description: "Employee Module",
      icon: "MdPeople",
      path: "/employees",
      sortOrder: 2,
    },

    {
      name: "Department",
      identifier: "department",
      description: "Department Module",
      icon: "MdBusiness",
      path: "/departments",
      sortOrder: 3,
    },

    {
      name: "Designation",
      identifier: "designation",
      description: "Designation Module",
      icon: "MdBadge",
      path: "/designations",
      sortOrder: 4,
    },

    {
      name: "Attendance",
      identifier: "attendance",
      description: "Attendance Module",
      icon: "MdAccessTime",
      path: "/attendance",
      sortOrder: 5,
    },

    {
      name: "Leave",
      identifier: "leave",
      description: "Leave Module",
      icon: "MdEventBusy",
      path: "/leave",
      sortOrder: 6,
    },

    {
      name: "Payroll",
      identifier: "payroll",
      description: "Payroll Module",
      icon: "MdPayments",
      path: "/payroll",
      sortOrder: 7,
    },

    {
      name: "project",
      identifier: "project",
      description: "project Module",
      icon: "MdAssignment",
      path: "/project",
      sortOrder: 8,
    },

    {
      name: "Recruitment",
      identifier: "recruitment",
      description: "Recruitment Module",
      icon: "MdWorkOutline",
      path: "/recruitment",
      sortOrder: 9,
    },

    {
      name: "Reports",
      identifier: "reports",
      description: "Reports Module",
      icon: "MdAssessment",
      path: "/reports",
      sortOrder: 10,
    },

    {
      name: "Calendar",
      identifier: "calendar",
      description: "Calendar Module",
      icon: "MdCalendarToday",
      path: "/calendar",
      sortOrder: 11,
    },

    {
      name: "Settings",
      identifier: "settings",
      description: "Settings Module",
      icon: "MdSettings",
      path: "/settings",
      sortOrder: 12,
    },
     {
      name: "profile",
      identifier: "profile",
      description: "profile Module",
      icon: "FiUser",
      path: "/profile",
      sortOrder: 12,
    },

  ];

  for (const module of modules) {

    const exists = await moduleRepo.findOne({
      where: {
        identifier: module.identifier,
      },
    });

    if (!exists) {
      await moduleRepo.save(module);
    }

  }

  console.log("Default Modules Seeded");
};