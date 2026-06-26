import { Router } from "express";
import { getMyProfile ,updateMyProfile} from "../../controllers/staff/myprofile.controller";
import { authMiddleware} from "../../middleware/auth.middleware";


const router = Router();

router.get("/",authMiddleware, getMyProfile);
router.put("/",authMiddleware, updateMyProfile);

export default router;