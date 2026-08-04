import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as skillController from "./skill.controller.js";

const router = Router();

router.get("/", requireAuth, skillController.getUserSkills);

export default router;
