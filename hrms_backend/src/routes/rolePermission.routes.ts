import { Router } from "express";
import {
  saveRolePermissions,
  getRolePermissions,
} from "../controllers/rolePermission.controller";

import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();


router.put("/", authMiddleware, saveRolePermissions);
router.get("/:roleId", authMiddleware, getRolePermissions);

export default router;
