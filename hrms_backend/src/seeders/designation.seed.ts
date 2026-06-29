import { DataSource } from "typeorm";
import { Department } from "../entity/tenant/department.entity";
import { Designation } from "../entity/tenant/designation.entity";
import { designationTemplates } from "../templates/designation.template";

export const seedDesignations = async (
  tenantDataSource: DataSource,
  industry: string
) => {

  const departmentRepo =
    tenantDataSource.getRepository(Department);

  const designationRepo =
    tenantDataSource.getRepository(Designation);

  const template =
    designationTemplates[industry as keyof typeof designationTemplates];

  if (!template) {
    console.log("Designation template not found");
    return;
  }

  const departments =
    await departmentRepo.find();

  for (const department of departments) {

    const designations =
      template[
        department.name as keyof typeof template
      ];

    if (!designations) continue;

    for (const designationName of designations){
      const existing =
        await designationRepo.findOne({
          where: {
            title: designationName,
            department: {
              id: department.id,
            },
          },
          relations: {
            department: true,
          },
        });

      if (!existing) {

        await designationRepo.save({

          title: designationName,

          department: department,

          is_deleted: false,

        });

      }

    }

  }

  console.log("Designations Seeded Successfully");

};