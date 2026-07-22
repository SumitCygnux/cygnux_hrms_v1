import { Request, Response } from "express";
import {
  createRoleCreatePermissionService,
  getRoleCreatePermissionService,
  getAllowedRolesService,
  updateRoleCreatePermissionService,
  deleteRoleCreatePermissionService,
} from "../services/role-create-permission.service";

export const createRoleCreatePermission = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const data = await createRoleCreatePermissionService(
      dbName,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Role Create Permission created successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRoleCreatePermission = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const data =
      await getRoleCreatePermissionService(dbName);

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

export const getAllowedRoles = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const roleId = req.params.roleId as string;

    const data = await getAllowedRolesService(
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

export const updateRoleCreatePermission = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const data = await updateRoleCreatePermissionService(
      dbName,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Role Create Permission updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRoleCreatePermission = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;
    const id=req.params.id as string

    const data =
      await deleteRoleCreatePermissionService(
        dbName,
        id
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
