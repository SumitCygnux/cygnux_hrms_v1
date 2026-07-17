import { getTenantConnection } from "../../connection/tenant.connection";
import { Leave } from "../../entity/tenant/staff/staff.leave.entity";

export const applyLeaveService = async (
  dbName: string,
  staffId: number,
    role: string,
  data: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const leaveRepo = dataSource.getRepository(Leave);

  let approverRole;
  if(role === "EMPLOYEE"){
    approverRole = "HR";
  }
  if(role === "HR" || role === "MANAGER"){
    approverRole = "TENANT_ADMIN";
  }

  const leave = leaveRepo.create({
    staffId,
    leaveType: data.leaveType,
    fromDate: data.fromDate,
    toDate: data.toDate,
    reason: data.reason,
    status: "PENDING",
     approverRole
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