import { Request, Response } from "express";
import {
  createStaffService,
  getAllStaffService,
  updateStaffStatusService,
  deleteStaffService,
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

export const updateStaffStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const { id } = req.params;
    const { status } = req.body;

    const staff = await updateStaffStatusService(
      dbName,
      Number(id),
      status
    );

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: staff,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteStaff = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const { id } = req.params;

    await deleteStaffService(
      dbName,
      Number(id)
    );

    return res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};