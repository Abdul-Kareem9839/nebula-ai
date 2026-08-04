import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

import * as resumeService from "./resume.service.js";

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a resume.");
  }

  const resume = await resumeService.uploadResume({
    userId: req.userId,
    file: req.file,
  });

  res.status(200).json({
    success: true,
    message: "Resume uploaded successfully.",
    data: resume,
  });
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResume(req.userId);

  res.status(200).json({
    success: true,
    data: resume,
  });
});

export const deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.userId);

  res.status(200).json({
    success: true,
    message: "Resume deleted successfully.",
  });
});
