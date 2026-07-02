import { getTenantConnection } from "../connection/tenant.connection";
import { Module } from "../entity/tenant/module.entity";

export const getModulesService = async (dbName: string) => {
  const dataSource = await getTenantConnection(dbName);

  const moduleRepo = dataSource.getRepository(Module);

  return await moduleRepo.find();
};