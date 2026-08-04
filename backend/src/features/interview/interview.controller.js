import * as interviewService from "./interview.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const start = asyncHandler(async (req, res) => {
  const {
    role,
    skillLevel,
    type = "technical",
    mentorPersonality = "friendly",
    mode = "manual",
    resumeAnalysis = null,
  } = req.body;
  const interview = await interviewService.startInterview({
    userId: req.userId,
    role,
    skillLevel,
    type,
    mentorPersonality,
    maxQuestions: req.body.maxQuestions || 5,
    mode,
    resumeAnalysis,
  });
  res.status(201).json({ success: true, interview });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const interview = await interviewService.submitAnswer({
    userId: req.userId,
    interviewId: req.params.id,
    answer: req.body.answer,
  });
  res.status(200).json({ success: true, interview });
});

export const end = asyncHandler(async (req, res) => {
  const interview = await interviewService.endInterview({
    userId: req.userId,
    interviewId: req.params.id,
  });
  res.status(200).json({ success: true, interview });
});

export const list = asyncHandler(async (req, res) => {
  const interviews = await interviewService.listInterviews(req.userId);
  res.status(200).json({ success: true, interviews });
});

export const getOne = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterview({
    userId: req.userId,
    interviewId: req.params.id,
  });

  res.status(200).json({ success: true, interview });
});

export const remove = asyncHandler(async (req, res) => {
  await interviewService.deleteInterview({
    userId: req.userId,
    interviewId: req.params.id,
  });

  res.status(200).json({ success: true, message: "Interview deleted." });
});
