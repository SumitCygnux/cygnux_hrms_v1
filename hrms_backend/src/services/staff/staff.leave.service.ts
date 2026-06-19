import { getTenantConnection } from "../../connection/tenant.connection";
import { Leave } from "../../entity/tenant/staff/staff.leave.entity";

export const applyLeaveService = async (
  dbName: string,
  staffId: number,
  data: any
) => {
 
  const dataSource = await getTenantConnection(dbName);

  const leaveRepo = dataSource.getRepository(Leave);

  const leave = leaveRepo.create({
    staffId,
    leaveType: data.leaveType,
    fromDate: data.fromDate,
    toDate: data.toDate,
    reason: data.reason,
    status: "PENDING",
  });

  return await leaveRepo.save(leave);
};


export const getLeaveService = async (
  dbName: string,
  staffId: number
) => {
  const dataSource = await getTenantConnection(dbName);

  const leaveRepo = dataSource.getRepository(Leave);

  const leaves = await leaveRepo.find({
    where: {
      staffId,
    },
    order: {
      createdAt: "DESC",
    },
  });

  return leaves;
};