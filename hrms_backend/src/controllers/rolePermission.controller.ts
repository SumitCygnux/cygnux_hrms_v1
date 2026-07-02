import { Request, Response } from "express";
import {
  saveRolePermissionsService,
  getRolePermissionsService,
} from "../services/rolePermission.service";

export const saveRolePermissions = async (
  req: Request,
  res: Response
) => {
  try {
    // const { dbName } = req.user ; 
const dbName = (req as any).user.dbName;
    const { roleId, permissions } = req.body;

    const result = await saveRolePermissionsService(
      dbName,
      roleId,
      permissions
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRolePermissions = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const { roleId } = req.params as any;

    const data = await getRolePermissionsService(
      dbName,
      roleId
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};