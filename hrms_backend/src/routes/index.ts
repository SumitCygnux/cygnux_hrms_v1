import { Router } from "express";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import designationRoutes from "./designation.routes";
import staffRoutes from "./staff.routes";
import leaveRoutes from "./staff/staff.leave.route";
import attendanceRoutes from "./attendance.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/departments",departmentRoutes);
router.use("/designations",designationRoutes);
router.use("/staff", staffRoutes);
router.use("/leave", leaveRoutes);
router.use("/attendance", attendanceRoutes);


export default router;