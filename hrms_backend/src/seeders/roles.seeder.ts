import DatabaseConnection from "../connection/postgresql.connection";
import { Roles } from "../entity/master/roles.entity";

export const seedRoles = async () => {


    const roleRepo =DatabaseConnection.getRepository(Roles);
    const roles = [
        "SUPER_ADMIN",
        "TENANT_ADMIN",
        "EMPLOYEE",
    ];
    for (const roleName of roles) {
        const existingRole =
            await roleRepo.findOne({
                where: {
                    name: roleName,
                },
            });
        if (!existingRole) {
            await roleRepo.save({
                name: roleName,
            });
        }
    }
    console.log("Roles Seeded Successfully");
};