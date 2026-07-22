import { Router } from "express";
import { applyLeave,getLeave } from "../../controllers/staff/staff.leave.controller";
import { authMiddleware} from "../../middleware/auth.middleware";

const router = Router();

router.post("/apply", authMiddleware, applyLeave);
router.get("/", authMiddleware, getLeave);
export default router; 
