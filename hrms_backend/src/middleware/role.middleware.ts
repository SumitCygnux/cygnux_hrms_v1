import {Request,Response,NextFunction} from "express";

export const authorize =(...roles: string[]) =>(req: Request,res: Response,next: NextFunction) => {

  try {
    const userRole = (req as any).user?.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message:
          "Access Denied",
      });
    }
    next();
  } catch (error) {

    return res.status(500).json({
      success: false,
      message:"Server Error",
    });

  }

};