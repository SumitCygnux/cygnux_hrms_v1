import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getTodayAttendance,
  getAttendanceHistory,
} from "../controllers/staff/attendance.controller";

const router = Router();

router.use(authMiddleware);

router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/break-out", startBreak);
router.post("/break-in", endBreak);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);

export default router;
