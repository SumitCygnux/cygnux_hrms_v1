import bcrypt from "bcrypt";
import { QueryRunner } from "typeorm";
import DatabaseConnection from "../connection/postgresql.connection";

import { Tenant_dbs } from "../entity/master/tenant_db.entity";
import { Users } from "../entity/master/users.entity";
import { Roles } from "../entity/master/roles.entity";

import { generateToken } from "../utils/jwt";

export const registerCompanyService = async (payload: any) => {
    const {
        companyName,
        companyEmail,
        phone,
        industry,
        companySize,
        country,
        state,
        city,
        address,

        adminName,
        adminEmail,
        password,
    } = payload;

    const userRepo = DatabaseConnection.getRepository(Users);

    const existingUser = await userRepo.findOne({
        where: {
            email: adminEmail,
        },
    });

    if (existingUser) {
        throw new Error("Admin email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const subdomain = companyName.toLowerCase().replace(/\s+/g, "_");
    const dbName = `hrms_${subdomain}`;

    const tenantRepo = DatabaseConnection.getRepository(Tenant_dbs);

    const tenant = await tenantRepo.save({
        name: companyName,
        company_email: companyEmail,
        phone,
        industry,
        company_size: companySize,
        country,
        state,
        city,
        address,
        subdomain,
        db_name: dbName,
    });

    const queryRunner = DatabaseConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query(
        `CREATE DATABASE "${dbName}"`
    );

    await queryRunner.release();

    const roleRepo = DatabaseConnection.getRepository(Roles);

    const tenantAdminRole = await roleRepo.findOne({
        where: {
            name: "TENANT_ADMIN",
        },
    });

    if (!tenantAdminRole) {
        throw new Error("TENANT_ADMIN role not found");
    }

    const user =
        await userRepo.save({
            email: adminEmail,
            password: hashedPassword,
            role_id: tenantAdminRole.id,
            tenant_id: tenant.id,
            db_name: tenant.db_name,
        });

    return {
        tenantId: tenant.id,
        companyName,
        companyEmail,
        adminName,
        adminEmail,
        subdomain,
        dbName,
        userId: user.id,
    };
};

export const loginService = async (payload: any) => {
    const { email, password } = payload;
    const userRepo = DatabaseConnection.getRepository(Users);

    const user = await userRepo.findOne({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid Email");
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        throw new Error("Invalid Password");
    }

    const token =
        generateToken({
            userId: user.id,
            tenantId: user.tenant_id,
            roleId: user.role_id,
            dbName: user.db_name,
        });

    return {
        token,
        user,
    };
};