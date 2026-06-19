import { Router } from "express";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import designationRoutes from "./designation.routes";
import staffRoutes from "./staff.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permission.routes";
import rolePermissionRoutes from "./rolePermission.routes";

import leaveRoutes from "./staff/staff.leave.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/departments",departmentRoutes);
router.use("/designations",designationRoutes);
router.use("/staff", staffRoutes);
router.use(
  "/roles",
  roleRoutes
);
router.use(
  "/permissions",
  permissionRoutes
);
router.use(
  "/role-permissions",
  rolePermissionRoutes
);

router.use("/leave", leaveRoutes);

export default router;