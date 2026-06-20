import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  createStaff,
  getAllStaff,
  updateStaffStatus,
  getStaffById,
    updateStaff,
     setupPassword,
     getAllLeave
} from "../controllers/staff.controller";

import { validate } from "../middleware/validate";

import { createStaffSchema } from "../dto/create-staff.dto";

const router = Router();

router.post("/", authMiddleware, validate(createStaffSchema), createStaff);
router.get("/", authMiddleware, getAllStaff);
router.get("/leave",authMiddleware, getAllLeave);
router.put("/setup-password", authMiddleware, setupPassword);
router.put("/:id/status", authMiddleware, updateStaffStatus);
router.get("/:id", authMiddleware, getStaffById);
router.put("/:id",authMiddleware, updateStaff);


export default router;
