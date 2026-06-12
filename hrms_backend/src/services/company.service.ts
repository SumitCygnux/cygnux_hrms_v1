import bcrypt from "bcrypt";
import { AppDataSource } from "../connection/dataSource";
import { Company } from "../entity/Company";
import { User } from "../entity/Users";

export const registerCompanyService = async (data: any) => {
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const companyRepo = queryRunner.manager.getRepository(Company);
    const userRepo = queryRunner.manager.getRepository(User);

    const companyExists = await companyRepo.findOne({
      where: {
        companyEmail:
          data.companyEmail,
      },
    });

    if (companyExists) {
      throw new Error("Company already exists");
    }

    const adminExists = await userRepo.findOne({
      where: {
        email:
          data.adminEmail,
      },
    });

    if (adminExists) {
      throw new Error("Admin already exists");
    }

    const company = companyRepo.create({
      companyName: data.companyName,
      companyEmail: data.companyEmail,
      phone: data.phone,
      industry: data.industry,
      companySize: data.companySize,
      country: data.country,
      state: data.state,
      city: data.city,
      address: data.address,
    });

    await companyRepo.save(company);

    const hashedPassword = await bcrypt.hash(
      data.password,
      10
    );

    const admin = userRepo.create({
      companyId: company.id,
      name: data.adminName,
      email: data.adminEmail,
      password: hashedPassword,
      role: "COMPANY_ADMIN",
    });

    await userRepo.save(admin);

    await queryRunner.commitTransaction();

    return {
      company,
      admin,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const getCompanyProfileService =
async (companyId: number) => {

  const companyRepo =AppDataSource.getRepository(Company);
  const userRepo = AppDataSource.getRepository(User);

  const company = await companyRepo.findOne({
      where: {
        id: companyId,
      },
    });

  if (!company) {
    throw new Error("Company not found");
  }
  const admin =await userRepo.findOne({
      where: {
        companyId,
        role: "COMPANY_ADMIN",
      },
    });

  return {
    company,
    admin: admin
      ? {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      : null,
  };
};