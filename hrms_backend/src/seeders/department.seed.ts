import { DataSource } from "typeorm";
import { Department } from "../entity/tenant/department.entity";
import { industryTemplates } from "../templates/industry.template";

export const seedDepartments = async (
  tenantDataSource: DataSource,
  industry: string
) => {
  const departmentRepo =
    tenantDataSource.getRepository(Department);
console.log("Industry:", industry);

  const departments =
  industryTemplates[industry as keyof typeof industryTemplates];

  console.log("Departments:", departments);

  if (!departments) {
    console.log("Industry template not found");
    return;
  }

  for (const departmentName of departments) {

    const existing =
      await departmentRepo.findOne({
        where: {
          name: departmentName,
        },
      });
      
    if (!existing) { 
      
       await departmentRepo.save({
        name: departmentName,
        openPositions: 0,

        is_deleted: false,
      });

    }
  }
  console.log("Departments Seeded Successfully");
};