import { Request, Response } from "express";
import {
  clockInService,
  clockOutService,
  startBreakService,
  endBreakService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
  resetAttendanceService,
} from "../../services/staff/attendance.service";

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const attendance = await clockInService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      message: "Clocked in successfully",
      data: attendance,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const attendance = await clockOutService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      message: "Clocked out successfully",
      data: attendance,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const startBreak = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const attendance = await startBreakService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      message: "Break started successfully",
      data: attendance,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const endBreak = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const attendance = await endBreakService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      message: "Break ended successfully",
      data: attendance,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const attendance = await getTodayAttendanceService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendanceHistory = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    const { startDate, endDate } = req.query;
    const history = await getAttendanceHistoryService(
      dbName,
      Number(staffId),
      startDate as string,
      endDate as string
    );
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetAttendance = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = (req as any).user;
    await resetAttendanceService(dbName, Number(staffId));
    return res.status(200).json({
      success: true,
      message: "Today's attendance reset successfully",
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
