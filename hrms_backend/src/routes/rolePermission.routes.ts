import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  saveRolePermissions,
  getRolePermissions,
} from "../controllers/rolePermission.controller";
import { checkPermission } from "../middleware/permission.middleware";

const router = Router();

router.put( "/", authMiddleware, checkPermission("role.update"),saveRolePermissions,);

router.get( "/:roleId", authMiddleware, checkPermission("role.view"), getRolePermissions,);

export default router;
