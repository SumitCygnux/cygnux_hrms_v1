import { Router } from "express";
import { getModules } from "../controllers/module.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getModules);

export default router;