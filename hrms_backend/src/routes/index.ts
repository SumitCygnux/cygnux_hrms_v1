import { Router } from "express";
import companyRoutes from "./company.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/company",companyRoutes);
router.use("/auth",authRoutes);

export default router;