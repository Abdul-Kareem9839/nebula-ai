import * as skillService from "./skill.service.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

export const getUserSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getUserSkills(req.userId);

  res.status(200).json({
    success: true,
    skills: skills.map((skill) => ({
      _id: skill._id,
      name: skill.name,
      score: skill.score,
      confidence: skill.confidence / 100,
      level: skill.level,
      interviewsAppeared: skill.interviewsAppeared,
      lastPracticed: skill.lastPracticed,
      category: "General",
      avgScore: skill.score,
      questionsAnswered: skill.interviewsAppeared,
      lastImproved: skill.lastPracticed
        ? new Date(skill.lastPracticed).toLocaleDateString()
        : "Recently",
    })),
  });
});
