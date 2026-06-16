import { Request, Response } from "express";
import { registerCompanyService, loginService } from "../services/auth.service";

export const registerCompany = async (req: Request, res: Response) => {
    const result = await registerCompanyService(req.body);
    return res.status(201).json({
        success: true,
        data: result,
    });
};

export const login = async (req: Request, res: Response) => {
    const result = await loginService(req.body);
    return res.status(200).json({
        success: true,
        data: result,
    });
};