import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getShiftAssignments,
  createShiftAssignment,
  updateShiftAssignment,
} from "../../controllers/admin/shiftAssignment.controller";

const router = Router();
router.use(authMiddleware);

router.get("/", getShiftAssignments);
router.post("/", createShiftAssignment);
router.put("/:id", updateShiftAssignment);

export default router;
