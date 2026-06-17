import { Router } from "express";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import designationRoutes from "./designation.routes";
import staffRoutes from "./staff.routes";


const router = Router();

router.use("/auth", authRoutes);
router.use("/departments",departmentRoutes);
router.use("/designations",designationRoutes);
router.use("/staff", staffRoutes);


export default router;