import { Router } from "express";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import designationRoutes from "./designation.routes";
import myprofile from "./staff/myprofile.routes";
import staffRoutes from "./staff.routes";
import leaveRoutes from "./staff/staff.leave.route";
import attendanceRoutes from "./staff/attendance.routes";
import adminAttendanceRoutes from "./admin/attendance.routes";
import attendanceReportRoutes from "./admin/report.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permission.routes";
import rolePermissionRoutes from "./rolePermission.routes";
import Payroll from "./payroll.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments", departmentRoutes);
router.use("/designations", designationRoutes);
router.use("/staff", staffRoutes);
router.use("/leave", leaveRoutes);
router.use("/myprofile", myprofile);
router.use("/payroll", Payroll);
router.use("/attendance", attendanceRoutes);
router.use("/attendance", adminAttendanceRoutes);
router.use("/attendance/reports", attendanceReportRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/role-permissions", rolePermissionRoutes);

export default router;
