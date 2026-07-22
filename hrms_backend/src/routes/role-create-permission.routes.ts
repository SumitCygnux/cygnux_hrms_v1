import { Router } from "express";
import {
  createRoleCreatePermission,
  getRoleCreatePermission,
  getAllowedRoles,
  updateRoleCreatePermission,
  deleteRoleCreatePermission,
} from "../controllers/role-create-permission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createRoleCreatePermission);

router.get("/", authMiddleware, getRoleCreatePermission);

router.get("/allowed-roles/:roleId", authMiddleware, getAllowedRoles);

router.put("/", authMiddleware, updateRoleCreatePermission); 

router.delete("/:id", authMiddleware, deleteRoleCreatePermission);

export default router;
