import { DataSource } from "typeorm";
import { Role } from "../entity/tenant/roles.entity";
import { Module } from "../entity/tenant/module.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

export const seedRolePermissions = async (
  tenantDataSource: DataSource
) => {
  const roleRepo = tenantDataSource.getRepository(Role);
  const moduleRepo = tenantDataSource.getRepository(Module);
  const rolePermissionRepo =
    tenantDataSource.getRepository(RolePermission);

  const roles = await roleRepo.find();
  const modules = await moduleRepo.find();

  for (const role of roles) {
    for (const module of modules) {

      let operations: any = null;

      switch (role.name) {

      

        case "SUPER_ADMIN":

          operations = {
            create: true,
            view: true,
            update: true,
            delete: true,
            approve: true,
            export: true,
          };

          break;


        case "TENANT_ADMIN":

          if (
            [
              "dashboard",
              "staff",
              "department",
              "designation",
              "attendance",
              "leave",
              "payroll",
              "performance",
              "reports",
              "profile",
              "calendar",
              "settings",
            ].includes(module.identifier)
          ) {

            operations = {
              create: true,
              view: true,
              update: true,
              delete: true,
              approve: true,
              export: true,
            };
          }

          break;


        case "HR":

          switch (module.identifier) {

            case "dashboard":
              operations = {
                view: true,
              };
              break;

            case "staff":
            case "department":
            case "designation":
            case "attendance":
            case "recruitment":

              operations = {
                create: true,
                view: true,
                update: true,
                delete: false,
              };

              break;

            case "leave":

              operations = {
                create: true,
                view: true,
                update: true,
                approve: true,
              };

              break;

               case "profile":

              operations = {
                view: true,
                update: true,
              };

              break;

            case "payroll":

              operations = {
                view: true,
              };

              break;
          }

          break;

      
        case "MANAGER":

          switch (module.identifier) {

            case "dashboard":

              operations = {
                view: true,
              };

              break;

            case "staff":

              operations = {
                view: true,
              };

              break;

            case "attendance":

              operations = {
                view: true,
              };

              break;

            case "leave":

              operations = {
                view: true,
                approve: true,
              };

              break;

            case "reports":

              operations = {
                view: true,
                export: true,
              };

              break;

               case "profile":

              operations = {
                view: true,
                update: true,
              };

              break;

          }

          break;

     

        case "EMPLOYEE":

          switch (module.identifier) {

            case "dashboard":

              operations = {
                view: true,
              };

              break;

            case "attendance":

              operations = {
                view: true,
              };

              break;

            case "leave":

              operations = {
                create: true,
                view: true,
              };

              break;

            case "profile":

              operations = {
                view: true,
                update: true,
              };

              break;

          }

          break;
      }

      if (!operations) continue;

      const exists = await rolePermissionRepo.findOne({
        where: {
          role: {
            id: role.id,
          },
          module: {
            id: module.id,
          },
        },
      });

      if (!exists) {

        await rolePermissionRepo.save({

          role,

          module,

          operations,

          isActive: true,

        });

      }

    }
  }

  console.log("Role Permissions Seeded Successfully");
};