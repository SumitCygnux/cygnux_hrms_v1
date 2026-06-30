import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getShifts,
  createShift,
  getShiftById,
  updateShift,
  deleteShift,
  getShiftAssignments,
  createShiftAssignment,
  updateShiftAssignment,
  getAttendanceSettings,
  updateAttendanceSettings,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getAttendanceRecords,
  updateAttendanceRecord,
  createManualAttendance,
  runMaintenance,
  getAttendanceMetrics,
  getAttendanceCharts,
  getAttendanceRequests,
  getAttendanceRequestById,
  approveAttendanceRequest,
  rejectAttendanceRequest,
} from "../../controllers/admin/attendance.controller";

const router = Router();
router.use(authMiddleware);


router.get("/dashboard/metrics", getAttendanceMetrics);
router.get("/dashboard/charts", getAttendanceCharts);


router.get("/records", getAttendanceRecords);
router.post("/records", createManualAttendance);
router.put("/records/:id", updateAttendanceRecord);
router.post("/maintenance/run", runMaintenance);


router.get("/shifts", getShifts);
router.post("/shifts", createShift);
router.get("/shifts/:id", getShiftById);
router.put("/shifts/:id", updateShift);
router.delete("/shifts/:id", deleteShift);


router.get("/shift-assignment", getShiftAssignments);
router.post("/shift-assignment", createShiftAssignment);
router.put("/shift-assignment/:id", updateShiftAssignment);


router.get("/settings", getAttendanceSettings);
router.put("/settings", updateAttendanceSettings);


router.get("/holidays", getHolidays);
router.post("/holidays", createHoliday);
router.put("/holidays/:id", updateHoliday);
router.delete("/holidays/:id", deleteHoliday);


router.get("/requests", getAttendanceRequests);
router.get("/requests/:id", getAttendanceRequestById);
router.put("/requests/:id/approve", approveAttendanceRequest);
router.put("/requests/:id/reject", rejectAttendanceRequest);

export default router;
