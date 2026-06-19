import { Router } from "express";

import {
  createRole,
  getRoles,
  updateRole,
} from "../controllers/role.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  createRole
);

router.get(
  "/",
  authMiddleware,
  getRoles
);

router.put(
  "/:id",
  authMiddleware,
  updateRole
);

export default router;