import bcrypt from "bcrypt";
import { QueryRunner } from "typeorm";
import DatabaseConnection from "../connection/postgresql.connection";

import { Tenant_dbs } from "../entity/master/tenant_db.entity";
import { Users } from "../entity/master/users.entity";
import { Roles } from "../entity/master/roles.entity";
import { Staff } from "../entity/tenant/staff.entity";
import { getTenantConnection } from "../connection/tenant.connection";
import { seedPermissions } from "../seeders/permission.seed";
import { Role } from "../entity/tenant/roles.entity";
import { Permission } from "../entity/tenant/permissions.entity";
import { RolePermission } from "../entity/tenant/rolePermission.entity";

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
    }
   
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
  await queryRunner.query(`CREATE DATABASE "${dbName}"`);

  await queryRunner.release();
  const tenantDataSource = await getTenantConnection(dbName);

await seedPermissions(tenantDataSource);

  const roleRepo = DatabaseConnection.getRepository(Roles);

  const tenantAdminRole = await roleRepo.findOne({
    where: {
      name: "TENANT_ADMIN",
    },
  });

  if (!tenantAdminRole) {
    throw new Error("TENANT_ADMIN role not found");
  }

  const user = await userRepo.save({
    email: adminEmail,
    name: adminName,
    
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
  const roleRepo = DatabaseConnection.getRepository(Roles);
  const tenantRepo = DatabaseConnection.getRepository(Tenant_dbs);

  // --- Admin login ---
  const user = await userRepo.findOne({ where: { email } });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid Password");

    const role = await roleRepo.findOne({ where: { id: user.role_id } });
    const company = await tenantRepo.findOne({ where: { id: user.tenant_id } });

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      roleId: user.role_id,
      dbName: user.db_name,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: role?.name,
        tenant_id: user.tenant_id,
        companyName: company?.name,
        db_name: user.db_name,
      },
    };
  }

  // --- Staff login: search all tenant databases ---
  const allTenants = await tenantRepo.find({ where: { is_active: true } });

  for (const tenant of allTenants) {
    const tenantConnection = await getTenantConnection(tenant.db_name);
    const staffRepo = tenantConnection.getRepository(Staff);
    const staff = await staffRepo.findOne({ where: { email } });
    

    if (staff) {
  if (staff.password !== password)
    throw new Error("Invalid Password");

  const roleRepo =
    tenantConnection.getRepository(Role);

  const permissionRepo =
    tenantConnection.getRepository(Permission);

  const rolePermissionRepo =
    tenantConnection.getRepository(RolePermission);

  const role = staff.accessRoleId
    ? await roleRepo.findOne({ where: { id: staff.accessRoleId } })
    : null;

  const rolePermissions = staff.accessRoleId
    ? await rolePermissionRepo.find({ where: { roleId: staff.accessRoleId } })
    : [];

  const permissionIds =
    rolePermissions.map(
      (rp) => rp.permissionId
    );

  const permissions =
    await permissionRepo.find();

  const permissionNames =
    permissions
      .filter((p) =>
        permissionIds.includes(p.id)
      )
      .map((p) => p.name);

  const token = generateToken({
    userId: staff.id,
    tenantId: tenant.id,
    roleId: staff.accessRoleId,
    dbName: tenant.db_name,
  });

  return {
    token,

    permissions: permissionNames,

    requiresPasswordSetup:
      staff.status === "InActive",

    user: {
      id: staff.id,
      name: staff.fullName,
      email: staff.email,

      role: role?.name,

      status: staff.status,
      tenant_id: tenant.id,
      companyName: tenant.name,
      db_name: tenant.db_name,
    },
  };
}
  }

  throw new Error("Invalid Email");
};
