import { Router } from "express";
import {
  createPayroll,
  getAllPayroll,
  getPayrollById,
  updatePayroll,
  processPayroll,
} from "../controllers/payroll.contoller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createPayroll);
router.get("/", authMiddleware, getAllPayroll);
router.get("/:id", authMiddleware, getPayrollById);
router.put("/:id", authMiddleware, updatePayroll);
router.put("/process/:id", authMiddleware, processPayroll);


export default router;