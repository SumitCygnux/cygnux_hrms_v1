import {Router}from "express";
import {createDesignation,getDesignations,updateDesignation,deleteDesignation}from "../controllers/designation.controller";
import {authMiddleware}from "../middleware/auth.middleware";

const router =Router();

router.post("/",authMiddleware,createDesignation);
router.get("/",authMiddleware,getDesignations);
router.put("/:id",authMiddleware,updateDesignation);
router.delete("/:id",authMiddleware,deleteDesignation);

export default router;