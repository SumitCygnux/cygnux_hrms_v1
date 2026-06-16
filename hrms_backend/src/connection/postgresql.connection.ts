import "reflect-metadata";

import { DataSource } from "typeorm";

import { Roles } from "../entity/master/roles.entity";
import { Tenant_dbs } from "../entity/master/tenant_db.entity";
import { Users } from "../entity/master/users.entity";

const DatabaseConnection =
  new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
      Roles,
      Tenant_dbs,
      Users,
    ],
  });

export default DatabaseConnection;