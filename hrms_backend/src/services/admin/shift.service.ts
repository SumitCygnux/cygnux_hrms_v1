import { getTenantConnection } from "../../connection/tenant.connection";
import { Shift } from "../../entity/tenant/shift.entity";

export const getShiftsService = async (dbName: string) => {
  const ds = await getTenantConnection(dbName);
  return await ds.getRepository(Shift).find({ order: { createdAt: "DESC" } });
};

export const createShiftService = async (dbName: string, data: any) => {
  const ds = await getTenantConnection(dbName);
  const repo = ds.getRepository(Shift);
  const shift = repo.create(data);
  return await repo.save(shift);
};

export const getShiftByIdService = async (dbName: string, id: string) => {
  const ds = await getTenantConnection(dbName);
  const shift = await ds.getRepository(Shift).findOne({ where: { id } });
  if (!shift) throw new Error("Shift not found");
  return shift;
};

export const updateShiftService = async (dbName: string, id: string, data: any) => {
  const ds = await getTenantConnection(dbName);
  const repo = ds.getRepository(Shift);
  const shift = await repo.findOne({ where: { id } });
  if (!shift) throw new Error("Shift not found");
  Object.assign(shift, data);
  return await repo.save(shift);
};

export const deleteShiftService = async (dbName: string, id: string) => {
  const ds = await getTenantConnection(dbName);
  const repo = ds.getRepository(Shift);
  const shift = await repo.findOne({ where: { id } });
  if (!shift) throw new Error("Shift not found");
  await repo.delete(id);
};
