import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getShifts,
  createShift,
  getShiftById,
  updateShift,
  deleteShift,
} from "../../controllers/admin/shift.controller";

const router = Router();
router.use(authMiddleware);

router.get("/", getShifts);
router.post("/", createShift);
router.get("/:id", getShiftById);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);

export default router;
