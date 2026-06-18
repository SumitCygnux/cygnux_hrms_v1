import { Request, Response } from "express";
import { createDepartmentService, getDepartmentsService, updateDepartmentService, deleteDepartmentService,getDepartmentHeadOptionsService } from "../services/department.service";

export const createDepartment = async (req: Request, res: Response) => {
    const dbName = (req as any).user.dbName;

    const result = await createDepartmentService(
        dbName,
        req.body
    );
    return res.status(201)
        .json({
            success: true,
            data: result
        });
};

export const getDepartments = async (req: Request, res: Response) => {
    const dbName = (req as any).user.dbName;
    const result = await getDepartmentsService(dbName);
    return res.status(200)
        .json({
            success: true,
            data: result
        });
};

export const updateDepartment = async (req: any, res: any) => {

    const result = await updateDepartmentService(
        req.user.dbName,
        req.params.id,
        req.body
    );
    res.json({
        success: true,
        data: result
    });
};

export const deleteDepartment = async (req: any, res: any) => {
    await deleteDepartmentService(
        req.user.dbName,
        req.params.id
    );

    res.json({
        success: true,
        message: "Department deleted successfully"
    });
};

export const getDepartmentHeadOptions = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;
    const userId = (req as any).user.userId;

    console.log("DB NAME =>", dbName);
    console.log("USER ID =>", userId);

    const result = await getDepartmentHeadOptionsService(
      dbName,
      userId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};