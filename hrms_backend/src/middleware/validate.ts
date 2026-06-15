import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validate =(schema: any) =>(req: Request,res: Response,next: NextFunction) => {
     try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: error.issues[0].message,
          errors: error.issues,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
};