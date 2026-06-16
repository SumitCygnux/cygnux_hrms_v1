import {Router}from "express";
import {createDesignation,getDesignations}from "../controllers/designation.controller";
import {authMiddleware}from "../middleware/auth.middleware";

const router =Router();

router.post("/",authMiddleware,createDesignation);
router.get("/",authMiddleware,getDesignations);

export default router;