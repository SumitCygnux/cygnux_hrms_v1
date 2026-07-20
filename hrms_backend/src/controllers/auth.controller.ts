import { Request, Response } from "express";
import { registerCompanyService, loginService } from "../services/auth.service";

export const registerCompany = async (req: Request, res: Response) => {
      

    try {
        const result = await registerCompanyService(req.body);
        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
              success: false,
            message: error.message || "Registration failed",
        });
    }
}; 
export const login = async (req: Request, res: Response) => {
    try {
        const result = await loginService(req.body);
        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};


