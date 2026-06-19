import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  saveRolePermissions,
  getRolePermissions,
} from "../controllers/rolePermission.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  saveRolePermissions
);

router.get(
  "/:roleId",
  authMiddleware,
  getRolePermissions
);

export default router;