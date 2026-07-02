import { Router } from "express";

import {
  createRole,
  getRoles,
  updateRole,
} from "../controllers/role.controller";

import { authMiddleware } from "../middleware/auth.middleware";


const router = Router();

router.get("/", authMiddleware, getRoles);


export default router;
