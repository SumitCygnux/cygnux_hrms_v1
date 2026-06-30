import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request,res: Response,next: NextFunction): any => {
  try {
    const authHeader =req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token Required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );
    (req as any).user = decoded;
     next();
  } catch (error) {
     console.log("JWT Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};