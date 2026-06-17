import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  createStaff,
  getAllStaff,
  updateStaffStatus,
  deleteStaff,
  getStaffById
} from "../controllers/staff.controller";

import { validate } from "../middleware/validate";

import { createStaffSchema } from "../dto/create-staff.dto";

const router = Router();

router.post("/", authMiddleware, validate(createStaffSchema), createStaff);
router.get("/", authMiddleware, getAllStaff);
router.put("/:id/status", authMiddleware, updateStaffStatus);
router.delete("/:id", authMiddleware, deleteStaff);
router.get("/:id", authMiddleware, getStaffById);

export default router;
