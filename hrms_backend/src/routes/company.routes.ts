import { Router } from "express";
import {registerCompany} from "../controllers/company.controller";
import {validate} from "../middleware/validate";
import {registerCompanySchema} from "../validations/company.validation";
import {getCompanyProfile,} from "../controllers/company.controller";
import {authenticate} from "../middleware/auth.middleware";
import {authorize} from "../middleware/role.middleware";

const router = Router();

router.post("/register",validate(registerCompanySchema),registerCompany);
router.get("/profile",authenticate,authorize("COMPANY_ADMIN"),getCompanyProfile);

export default router;