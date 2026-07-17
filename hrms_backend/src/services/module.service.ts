import { getTenantConnection } from "../connection/tenant.connection";
import { Module } from "../entity/tenant/module.entity";
import { IsNull } from "typeorm";
export const getModulesService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const moduleRepo = dataSource.getRepository(Module);

    return await moduleRepo.find({
    where: {
    parent: IsNull(),
  },
  relations: {
    children: true,
  },
  order: {
    sortOrder: "ASC",
    children: {
      sortOrder: "ASC",
    },
  },
  });

};