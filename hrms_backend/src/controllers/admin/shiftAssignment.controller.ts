import { Request, Response } from "express";
import {
  getShiftAssignmentsService,
  createShiftAssignmentService,
  updateShiftAssignmentService,
} from "../../services/admin/shiftAssignment.service";

const getUser = (req: Request) => (req as any).user as { userId: string; dbName: string };

export const getShiftAssignments = async (req: Request, res: Response) => {
  try {
    const { dbName } = getUser(req);
    const data = await getShiftAssignmentsService(dbName);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const createShiftAssignment = async (req: Request, res: Response) => {
  try {
    const { dbName, userId } = getUser(req);
    const data = await createShiftAssignmentService(dbName, { ...req.body, assignedBy: userId });
    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export const updateShiftAssignment = async (req: Request, res: Response) => {
  try {
    const { dbName } = getUser(req);
    const data = await updateShiftAssignmentService(dbName, String(req.params.id), req.body);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message });
  }
};
