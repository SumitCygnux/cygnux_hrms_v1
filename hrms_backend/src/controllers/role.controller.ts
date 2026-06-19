import { Request, Response } from "express";
import {createRoleService,getRolesService,updateRoleService} from "../services/role.service";

export const createRole = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const result = await createRoleService(
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

export const getRoles = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const result = await getRolesService(dbName);
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

export const updateRole = async (req: Request,res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const id = req.params.id as string;
    const result = await updateRoleService(
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

