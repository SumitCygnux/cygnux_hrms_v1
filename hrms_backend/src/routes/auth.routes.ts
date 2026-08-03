import { Router } from "express";
import { registerCompany,login }from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register-company",registerCompany);
router.post("/login",login);
router.get("/profile",authMiddleware,(req, res) => {
    return res.json({
      success: true,
      user: (req as any).user,
    });
}
);

export default router;