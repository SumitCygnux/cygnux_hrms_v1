// import { Router } from "express";
// import { authMiddleware } from "../../middleware/auth.middleware";
// import {
//   clockIn,
//   clockOut,
//   startBreak,
//   endBreak,
//   getTodayAttendance,
//   getAttendanceHistory,
//   getStaffDashboard,
//   createMyRequest,
//   getMyRequests,
//   resetAttendance,
// } from "../../controllers/staff/attendance.controller";

// const router = Router();

// router.use(authMiddleware);

// router.post("/clock-in", clockIn);
// router.post("/clock-out", clockOut);
// router.post("/break-in", startBreak);
// router.post("/break-out", endBreak);
// router.get("/dashboard", getStaffDashboard);
// router.get("/today", getTodayAttendance);
// router.get("/history", getAttendanceHistory);
// router.get("/my-requests", getMyRequests);
// router.post("/requests", createMyRequest);
// router.delete("/reset", resetAttendance);

// export default router;

import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getTodayAttendance,
  getAttendanceHistory,
  getStaffDashboard,
  createMyRequest,
  getMyRequests,
  resetAttendance,
  clockInController,
  clockOutController,
  startBreakController,
  endBreakController,
  getStaffShiftController,
checkHolidayController
} from "../../controllers/staff/attendance.controller";

const router = Router();

router.use(authMiddleware);


router.post("/clock-in", clockInController);
router.post("/clock-out", clockOutController);
router.post("/start-break", startBreakController);
router.post("/end-break", endBreakController);
router.get("/shift/:staffId", getStaffShiftController);
router.get("/holiday/:date", checkHolidayController);


router.get("/dashboard", getStaffDashboard);
router.get("/today", getTodayAttendance);
router.get("/history", getAttendanceHistory);
router.get("/my-requests", getMyRequests);
router.post("/requests", createMyRequest);
router.delete("/reset", resetAttendance);

export default router;
