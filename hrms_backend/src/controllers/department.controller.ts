import { Request, Response } from "express";
import { createDepartmentService, getDepartmentsService } from "../services/department.service";

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

export const getDepartments =async (req: Request, res: Response) => {
        const dbName = (req as any).user.dbName;
        const result = await getDepartmentsService(dbName);
        return res.status(200)
            .json({
                success: true,
                data: result
            });
    };