import {Router} from "express"; 
import {authMiddleware} from "../../middleware/auth.middleware";
import {
  createLeavePolicy,
    getLeavePolicies,
    updateLeavePolicy,
    deleteLeavePolicy
} from "../../controllers/admin/leavePolicy.controller";    

import {  createLeavePolicySchema,updateLeavePolicySchema, } from "../../dto/leavePolicy.dto";
import { validate } from "../../middleware/validate";

const router = Router();

router.post("/", authMiddleware, validate(createLeavePolicySchema), createLeavePolicy);
router.get("/", authMiddleware, getLeavePolicies);
router.put("/:id", authMiddleware, validate(updateLeavePolicySchema), updateLeavePolicy);
router.delete("/:id", authMiddleware, deleteLeavePolicy);


export default router;
