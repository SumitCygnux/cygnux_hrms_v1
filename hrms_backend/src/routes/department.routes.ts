import {Router}from "express";
import {createDepartment,getDepartments, updateDepartment, deleteDepartment, getDepartmentHeadOptions}from "../controllers/department.controller";
import {authMiddleware}from "../middleware/auth.middleware";

const router =Router();

router.post("/",authMiddleware,createDepartment);
router.get("/",authMiddleware,getDepartments);
router.put("/:id",authMiddleware,updateDepartment);
router.delete("/:id",authMiddleware,deleteDepartment);
router.get("/head-options",authMiddleware,getDepartmentHeadOptions);

export default router;