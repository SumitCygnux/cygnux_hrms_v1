import { Request, Response } from "express";

import {
  createPermissionService,
  getPermissionsService,
  updatePermissionService,
  deletePermissionService,
} from "../services/permission.service";

export const createPermission = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const result = await createPermissionService(
      dbName,
      req.body
    );
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPermission = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const result = await getPermissionsService(dbName);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePermission = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const id = req.params.id as string;
    const result = await updatePermissionService(
      dbName,
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePermission = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const id = req.params.id as string;
    const result = await deletePermissionService(
      dbName,
      id
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};