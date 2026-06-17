import { Request, Response } from "express";
import {
  createStaffService,
  getAllStaffService,
} from "../services/staff.service";

export const createStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const staff = await createStaffService(
      dbName,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: staff,
    });
  }catch (error: any) {
  console.error("Create Staff Error:", error);
  return res.status(500).json({
    success: false,
    message: error.message,
  });
  }
};

export const getAllStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const staff = await getAllStaffService(
      dbName
    );

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};