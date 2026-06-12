import { Request, Response, NextFunction } from "express";

export const validate =(schema: any) =>(req: Request,res: Response,next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {

  console.log(error);

  return res.status(400).json({
    success: false,
    errors: error.errors,
    message: error.message,
  });

}
};