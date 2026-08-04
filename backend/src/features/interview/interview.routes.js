import { Router } from "express";
import * as interviewController from "./interview.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.post("/", interviewController.start);
router.get("/", interviewController.list);
router.get("/:id", interviewController.getOne);
router.delete("/:id", interviewController.remove);
router.post("/:id/answer", interviewController.submitAnswer);
router.post("/:id/end", interviewController.end);

export default router;
