import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controller";

const router = Router();

router.post("/", authMiddleware, createPermission);
router.get("/", authMiddleware, getPermission);
router.put("/:id", authMiddleware, updatePermission);
router.delete("/:id", authMiddleware, deletePermission);

export default router;