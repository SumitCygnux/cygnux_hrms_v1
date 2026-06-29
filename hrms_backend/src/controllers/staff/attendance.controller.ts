import { Request, Response } from "express";
import {
  clockInService,
  clockOutService,
  startBreakService,
  endBreakService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
  getStaffDashboardService,
  createAttendanceRequestService,
  getMyRequestsService,
  resetAttendanceService,
} from "../../services/staff/attendance.service";
import { getClientIp } from "../../utils/attendance.util";

const getCtx = (req: Request) => (req as any).user as { userId: number; dbName: string };

export const clockIn = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const attendance = await clockInService(dbName, Number(staffId), {
      ip: getClientIp(req),
      userAgent: req.headers["user-agent"] || null,
    });
    return res.status(200).json({ success: true, message: "Clocked in successfully", data: attendance });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const clockOut = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const attendance = await clockOutService(dbName, Number(staffId));
    return res.status(200).json({ success: true, message: "Clocked out successfully", data: attendance });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const startBreak = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const attendance = await startBreakService(dbName, Number(staffId), req.body || {});
    return res.status(200).json({ success: true, message: "Break started successfully", data: attendance });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const endBreak = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const attendance = await endBreakService(dbName, Number(staffId), req.body || {});
    return res.status(200).json({ success: true, message: "Break ended successfully", data: attendance });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTodayAttendance = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const data = await getTodayAttendanceService(dbName, Number(staffId));
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAttendanceHistory = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const { startDate, endDate } = req.query;
    const history = await getAttendanceHistoryService(
      dbName,
      Number(staffId),
      startDate as string,
      endDate as string
    );
    return res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getStaffDashboard = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const data = await getStaffDashboardService(dbName, Number(staffId));
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createMyRequest = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const data = await createAttendanceRequestService(dbName, Number(staffId), req.body);
    return res.status(201).json({ success: true, message: "Request submitted", data });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getMyRequests = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    const data = await getMyRequestsService(dbName, Number(staffId));
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const resetAttendance = async (req: Request, res: Response) => {
  try {
    const { userId: staffId, dbName } = getCtx(req);
    await resetAttendanceService(dbName, Number(staffId));
    return res.status(200).json({ success: true, message: "Today's attendance reset successfully" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
