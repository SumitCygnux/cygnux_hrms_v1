import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getTodayAttendance,
  getAttendanceHistory,
  resetAttendance,
} from "../../controllers/staff/attendance.controller";

const router = Router();

router.use(authMiddleware);

router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/break-in", startBreak);
router.post("/break-out", endBreak);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);
router.delete("/reset", resetAttendance);

export default router;
