import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../../middleware/auth.js";
import * as resumeController from "./resume.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter(req, file, cb) {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF, DOC, and DOCX files are allowed."));
    }

    cb(null, true);
  },
});

const router = Router();

router.post(
  "/upload",
  requireAuth,
  upload.single("resume"),
  resumeController.uploadResume,
);

router.get("/", requireAuth, resumeController.getResume);

router.delete("/", requireAuth, resumeController.deleteResume);

export default router;
