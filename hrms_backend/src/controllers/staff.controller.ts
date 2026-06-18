import { Request, Response } from "express";
import {
  createStaffService,
  getAllStaffService,
  updateStaffStatusService,
  deleteStaffService,
  getStaffByIdService,
  setupPasswordService,
} from "../services/staff.service";
import { number } from "zod";

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

export const getStaffById = async (
  req: Request,
  res: Response
) => {
  try {
    const dbName = (req as any).user.dbName;

    const staff = await getStaffByIdService(
      dbName,
      Number(req.params.id)
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

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

export const setupPassword = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    await setupPasswordService(user.dbName, Number(user.userId), newPassword);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};