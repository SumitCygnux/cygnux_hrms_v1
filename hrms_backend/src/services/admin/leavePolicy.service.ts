import {getTenantConnection} from "../../connection/tenant.connection";
import { LeavePolicy } from "../../entity/tenant/leavePolicy.entity";

export const createLeavePolicyService = async (
  dbName: string,
  body: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const leavePolicyRepo =
    dataSource.getRepository(LeavePolicy);

  // Optional: Prevent duplicate leave type
  const existingPolicy = await leavePolicyRepo.findOne({
    where: {
      leaveType: body.leaveType,
    },
  });

  if (existingPolicy) {
    throw new Error("Leave policy already exists.");
  }

  const leavePolicy = leavePolicyRepo.create({
    leaveType: body.leaveType,
    annualLimit: body.isUnlimited ? null : body.annualLimit,
    isUnlimited: body.isUnlimited,
    carryForward: body.carryForward,
    accrualCycle: body.accrualCycle,
    status: body.status ?? true,
  });
  return await leavePolicyRepo.save(leavePolicy);
};

export const getLeavePoliciesService = async (
  dbName: string
) => {
  const dataSource = await getTenantConnection(dbName);
  const leavePolicyRepo =
    dataSource.getRepository(LeavePolicy);

  return await leavePolicyRepo.find({
    order: {
      createdAt: "ASC",
    },
  });
};

export const updateLeavePolicyService = async (
  dbName: string,
  id: string,
  body: any
) => {
  const dataSource = await getTenantConnection(dbName);

  const leavePolicyRepo =
    dataSource.getRepository(LeavePolicy);

  const policy = await leavePolicyRepo.findOne({
    where: { id },
  });

  if (!policy) {
    throw new Error("Leave policy not found.");
  }

  policy.leaveType = body.leaveType;
  policy.annualLimit = body.isUnlimited
    ? null
    : body.annualLimit;
  policy.isUnlimited = body.isUnlimited;
  policy.carryForward = body.carryForward;
  policy.accrualCycle = body.accrualCycle;
  policy.status = body.status;

  return await leavePolicyRepo.save(policy);
};

export const deleteLeavePolicyService = async (
  dbName: string,
  id: string
) => {
  const dataSource = await getTenantConnection(dbName);

  const leavePolicyRepo =
    dataSource.getRepository(LeavePolicy);

  const policy = await leavePolicyRepo.findOne({
    where: { id },
  });

  if (!policy) {
    throw new Error("Leave policy not found.");
  }

  await leavePolicyRepo.remove(policy);

  return true;
};