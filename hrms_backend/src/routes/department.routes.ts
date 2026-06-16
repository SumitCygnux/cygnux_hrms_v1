import {Router}from "express";
import {createDepartment,getDepartments}from "../controllers/department.controller";
import {authMiddleware}from "../middleware/auth.middleware";

const router =Router();

router.post("/",authMiddleware,createDepartment);
router.get("/",authMiddleware,getDepartments);

export default router;