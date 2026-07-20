import { Router } from "express";

import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} from "../controllers/team.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";

import { createTeamSchema,updateTeamSchema } from "../dto/team.dto";
const router = Router();

router.post("/", authMiddleware,validate(createTeamSchema),createTeam);

router.get("/", authMiddleware,getTeams);

router.get("/:id", authMiddleware,getTeamById);

router.put("/:id", authMiddleware,validate(updateTeamSchema), updateTeam);

router.delete("/:id", authMiddleware, deleteTeam);

export default router;