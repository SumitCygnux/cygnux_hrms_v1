
import { Request, Response } from "express";
import {
  createLeavePolicyService,
  getLeavePoliciesService,
  updateLeavePolicyService,
  deleteLeavePolicyService,
} from "../../services/admin/leavePolicy.service";

export const createLeavePolicy = async (req: Request, res: Response) => {
  try {
  
    const dbName = (req as any).user.dbName;
    const data = await createLeavePolicyService(dbName, req.body);

    return res.status(201).json({
      success: true,
      message: "Leave Policy Created Successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLeavePolicies = async (req: Request, res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const data = await getLeavePoliciesService(dbName);

    return res.status(200).json({ 
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLeavePolicy = async (req: Request, res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const policyId = req.params.id as string; 
    
    const data = await updateLeavePolicyService(
      dbName,
      policyId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Leave Policy Updated Successfully",
      data,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLeavePolicy = async (req: Request, res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const policyId = req.params.id as string;

    await deleteLeavePolicyService(dbName, policyId);

    return res.status(200).json({
      success: true,
      message: "Leave Policy Deleted Successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
