import { Request, Response } from "express";
import { getModulesService } from "../services/module.service";

export const getModules = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const data = await getModulesService(dbName);

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error: any) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};