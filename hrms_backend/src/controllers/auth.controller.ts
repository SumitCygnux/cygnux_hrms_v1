import {Request,Response} from "express";
import {loginService} from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body;

      const result = await loginService(
          email,
          password
        );

      return res.status(200).json({
        success: true,
        message:"Login Successful",
        data: result,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  };