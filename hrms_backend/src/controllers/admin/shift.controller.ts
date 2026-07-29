import { Request, Response } from "express";
import {
  getShiftsService,
  createShiftService,
  getShiftByIdService,
  updateShiftService,
  deleteShiftService,
} from "../../services/admin/shift.service";

export const getShifts = async (req: Request, res: Response) => {
  try {
    const dbName = (req as any).user.dbName;
    const data = await getShiftsService(dbName);
    return res.json({ success: true, data });
  }catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
 
export const createShift = async (req: Request, res: Response) => {
  try { 
   const dbName = (req as any).user.dbName;
    const data = await createShiftService(dbName, req.body);
    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const getShiftById = async (req: Request, res: Response) => {
  try {
  const dbName = (req as any).user.dbName;
    const data = await getShiftByIdService(dbName, String(req.params.id));
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(404).json({ success: false, message: e.message });
  }
};

export const updateShift = async (req: Request, res: Response) => {
  try {
  const dbName = (req as any).user.dbName;
    const data = await updateShiftService(dbName, String(req.params.id), req.body);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteShift = async (req: Request, res: Response) => {
  try {
const dbName = (req as any).user.dbName;
    await deleteShiftService(dbName, String(req.params.id));
    return res.json({ success: true, message: "Shift deleted successfully" });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
