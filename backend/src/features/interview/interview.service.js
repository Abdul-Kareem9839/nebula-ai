import { Interview } from "./interview.model.js";
import { User } from "../auth/user.model.js";
import { getProvider } from "../../services/ai/index.js";
import { buildInterviewSystemPrompt } from "./mentorPersonas.js";
import { ApiError } from "../../utils/ApiError.js";
import { logger } from "../../utils/logger.js";
import { aiService } from "../../services/ai/ai.service.js";
import { updateSkills } from "../skills/skill.service.js";

function normalizeScore(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeSkillValue(value) {
  const normalized = normalizeScore(value);
  if (normalized == null) return 0;
  if (normalized > 1) return Math.max(0, Math.min(100, normalized));
  return Math.max(0, Math.min(100, normalized * 100));
}

function normalizeInterviewSummary(summary) {
  return {
    summary: {
      strengths: Array.isArray(summary?.summary?.strengths)
        ? summary.summary.strengths
        : [],
      weaknesses: Array.isArray(summary?.summary?.weaknesses)
        ? summary.summary.weaknesses
        : [],
      overallFeedback:
        typeof summary?.summary?.overallFeedback === "string"
          ? summary.summary.overallFeedback
          : "",
    },
    overallScore: normalizeScore(summary?.overallScore),
    technicalScore: normalizeScore(summary?.technicalScore),
    communicationScore: normalizeScore(summary?.communicationScore),
    problemSolvingScore: normalizeScore(summary?.problemSolvingScore),
    confidenceScore: normalizeScore(summary?.confidenceScore),
    skills: normalizeSkills(summary?.skills),
    ai:
      typeof summary?.ai === "object" && summary.ai !== null ? summary.ai : {},
  };
}

function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return {
          name: skill,
          score: 70,
          confidence: 0.7,
          level: 2,
        };
      }

      if (typeof skill === "object" && skill !== null) {
        return {
          name: typeof skill.name === "string" ? skill.name : "",
          score: normalizeSkillValue(skill.score),
          confidence: normalizeSkillValue(skill.confidence),
          level: normalizeScore(skill.level) ?? 1,
        };
      }

      return null;
    })
    .filter((skill) => skill && skill.name);
}

function deriveFallbackSkills(interview) {
  const role = String(interview?.role || "").toLowerCase();
  const lowercasedText = (interview?.turns || [])
    .map((turn) => turn.answer?.text || "")
    .join(" ")
    .toLowerCase();

  const roleSkills = [];
  if (role.includes("frontend") || role.includes("web")) {
    roleSkills.push("React", "JavaScript", "UI Engineering");
  }
  if (
    role.includes("backend") ||
    role.includes("server") ||
    role.includes("api")
  ) {
    roleSkills.push("Node.js", "APIs", "Database Design");
  }
  if (role.includes("full stack")) {
    roleSkills.push("System Design", "Architecture");
  }
  if (role.includes("data")) {
    roleSkills.push("SQL", "Analytics");
  }
  if (role.includes("ai") || role.includes("ml")) {
    roleSkills.push("AI Concepts", "Prompt Engineering");
  }

  const keywordSkills = [];
  const keywordMap = [
    ["react", "React"],
    ["javascript", "JavaScript"],
    ["typescript", "TypeScript"],
    ["node", "Node.js"],
    ["api", "APIs"],
    ["database", "Databases"],
    ["sql", "SQL"],
    ["docker", "Docker"],
    ["testing", "Testing"],
    ["system design", "System Design"],
    ["prompt", "Prompt Engineering"],
  ];

  keywordMap.forEach(([keyword, label]) => {
    if (lowercasedText.includes(keyword)) keywordSkills.push(label);
  });

  const combinedSkills = [...roleSkills, ...keywordSkills];
  const uniqueSkills = Array.from(new Set(combinedSkills));

  return uniqueSkills.slice(0, 5).map((name) => ({
    name,
    score: 72,
    confidence: 0.74,
    level: 2,
  }));
}

export function buildFallbackInterviewSummary(interview) {
  const completedTurns = (interview?.turns || []).filter(
    (turn) => turn.answer?.text,
  );
  const fallbackScore = completedTurns.length
    ? completedTurns.reduce(
        (total, turn) => total + (normalizeScore(turn?.evaluation?.score) || 0),
        0,
      ) / completedTurns.length
    : 0;

  const overallFeedback =
    completedTurns[0]?.evaluation?.feedback ||
    "Interview completed with local fallback analysis while AI evaluation was unavailable.";

  return {
    summary: {
      strengths: [],
      weaknesses: [],
      overallFeedback,
    },
    overallScore: fallbackScore,
    technicalScore: fallbackScore,
    communicationScore: fallbackScore,
    problemSolvingScore: fallbackScore,
    confidenceScore: fallbackScore,
    skills: deriveFallbackSkills(interview),
    ai: {},
  };
}

function buildFallbackEvaluation(interview, answer) {
  const completedTurns = (interview?.turns || []).filter(
    (turn) => turn.answer?.text,
  );
  const fallbackScore = completedTurns.length
    ? completedTurns.reduce(
        (total, turn) => total + (normalizeScore(turn?.evaluation?.score) || 0),
        0,
      ) / completedTurns.length
    : 0;

  return {
    evaluation: {
      score: Math.round(fallbackScore || 70),
      feedback:
        answer && answer.trim()
          ? `Your answer was recorded. The AI evaluator is currently unavailable, so this review uses a local fallback score.`
          : "No answer was provided for this question.",
      strengths: [],
      weaknesses: [],
    },
    nextQuestion: "Could you expand on your approach with a concrete example?",
    nextDifficulty: "medium",
  };
}

async function finalizeInterview(interview) {
  let summary;

  try {
    summary = await aiService.summarizeInterview(interview);
  } catch (error) {
    logger.warn(
      "Interview summarization failed; using fallback summary.",
      error,
    );
    summary = buildFallbackInterviewSummary(interview);
  }

  const normalized = normalizeInterviewSummary(summary);

  interview.status = "completed";

  interview.summary = normalized.summary;
  interview.overallScore = normalized.overallScore;
  interview.technicalScore = normalized.technicalScore;
  interview.communicationScore = normalized.communicationScore;
  interview.problemSolvingScore = normalized.problemSolvingScore;
  interview.confidenceScore = normalized.confidenceScore;
  interview.skills = normalized.skills;
  interview.ai = normalized.ai;

  await interview.save();

  const normalizedSkills = (normalized.skills || [])
    .map((skill) => ({
      name: skill?.name || "",
      score: normalizeSkillValue(skill?.score),
      confidence: normalizeSkillValue(skill?.confidence),
      level: normalizeScore(skill?.level) ?? 1,
    }))
    .filter((skill) => skill.name);

  if (normalizedSkills.length) {
    await updateSkills(interview.userId, normalizedSkills);
  }

  const user = await User.findById(interview.userId);
  if (user) {
    const completedTurns = interview.turns.filter((turn) => turn.answer?.text);
    const averageScore = completedTurns.length
      ? completedTurns.reduce(
          (total, turn) => total + (turn.evaluation?.score || 0),
          0,
        ) / completedTurns.length
      : 0;
    const averageConfidence = completedTurns.length
      ? completedTurns.reduce(
          (total, turn) => total + (turn.answer?.confidence || 0),
          0,
        ) / completedTurns.length
      : 0;
    const topicHints = completedTurns
      .map((turn) => turn.question?.topic)
      .filter(Boolean)
      .slice(0, 6);
    const strengths = summary?.summary?.strengths || [];
    const weaknesses = summary?.summary?.weaknesses || [];

    user.careerProfile = {
      ...user.careerProfile,
      knownSkills: Array.from(
        new Set([
          ...(user.careerProfile?.knownSkills || []),
          ...(interview.skills || [])
            .map((skill) => skill.name)
            .filter(Boolean),
        ]),
      ),
      weakSkills: Array.from(
        new Set([...(user.careerProfile?.weakSkills || []), ...weaknesses]),
      ),
      averageScore: Math.round(
        ((user.careerProfile?.averageScore || 0) + averageScore) / 2,
      ),
      averageConfidence: Math.round(
        ((user.careerProfile?.averageConfidence || 0) + averageConfidence) / 2,
      ),
      frequentlyAskedTopics: Array.from(
        new Set([
          ...(user.careerProfile?.frequentlyAskedTopics || []),
          ...topicHints,
        ]),
      ),
      interviewCount: (user.careerProfile?.interviewCount || 0) + 1,
      strongestArea: strengths[0] || user.careerProfile?.strongestArea || "",
      weakestArea: weaknesses[0] || user.careerProfile?.weakestArea || "",
    };

    await user.save();
  }

  return interview;
}

export async function startInterview({
  userId,
  role,
  skillLevel,
  mentorPersonality = "friendly",
  type = "technical",
  maxQuestions = 5,
  mode = "manual",
  resumeAnalysis = null,
}) {
  const interview = await Interview.create({
    userId,
    role,
    skillLevel,
    mentorPersonality,
    type,
    maxQuestions,
    mode,
    resumeAnalysis,
    status: "in_progress",
    turns: [],
  });

  const systemPrompt = buildInterviewSystemPrompt({
    role,
    skillLevel,
    type,
    personality: mentorPersonality,
    maxQuestions,
    mode,
    resumeAnalysis,
  });

  let firstQuestion = "Tell me about yourself and your background.";

  try {
    const { content } = await getProvider().chat({
      systemPrompt,
      messages: [
        {
          role: "user",
          content: "Start the interview. Ask the first question only.",
        },
      ],
    });

    if (typeof content === "string" && content.trim()) {
      firstQuestion = content.trim();
    }
  } catch (error) {
    logger.warn(
      "AI question generation failed; using fallback question.",
      error,
    );
  }

  interview.turns.push({
    question: {
      text: firstQuestion,
      difficulty: "medium",
    },
  });

  await interview.save();

  return interview;
}

export async function submitAnswer({ userId, interviewId, answer }) {
  const interview = await Interview.findOne({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found.");
  }

  if (interview.status !== "in_progress") {
    throw new ApiError(400, "Interview has already ended.");
  }

  const currentTurn = interview.turns[interview.turns.length - 1];

  // Save user's answer
  currentTurn.answer = {
    text: answer,
  };

  let result;

  try {
    result = await aiService.evaluateAnswer({
      interview,
      answer,
      generateNextQuestion: interview.turns.length < interview.maxQuestions,
    });
  } catch (error) {
    logger.warn(
      "AI answer evaluation failed; using fallback evaluation.",
      error,
    );
    result = buildFallbackEvaluation(interview, answer);
  }

  currentTurn.evaluation = result.evaluation;

  if (interview.turns.length >= interview.maxQuestions) {
    return await finalizeInterview(interview);
  }

  interview.turns.push({
    question: {
      text: result.nextQuestion,
      difficulty: result.nextDifficulty,
    },
  });

  await interview.save();

  return interview;
}

export async function endInterview({ userId, interviewId }) {
  const interview = await Interview.findOne({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found.");
  }

  if (interview.status === "completed" && interview.overallScore > 0) {
    return interview;
  }

  return await finalizeInterview(interview);
}

export async function getInterview({ userId, interviewId }) {
  const interview = await Interview.findOne({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found.");
  }

  return interview;
}

export async function deleteInterview({ userId, interviewId }) {
  const interview = await Interview.findOneAndDelete({
    _id: interviewId,
    userId,
  });

  if (!interview) {
    throw new ApiError(404, "Interview not found.");
  }

  return interview;
}

export async function listInterviews(userId) {
  return Interview.find({
    userId,
  }).sort({
    createdAt: -1,
  });
}
