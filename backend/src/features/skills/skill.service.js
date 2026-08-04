import { UserSkill } from "./skill.model.js";

function normalizeSkillValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  if (value > 1) return Math.max(0, Math.min(100, value));
  return Math.max(0, Math.min(100, value * 100));
}

export async function updateSkills(userId, skills = []) {
  const alpha = 0.4;

  for (const skill of skills) {
    const { name, score = 0, confidence = 50 } = skill;
    const normalizedScore = normalizeSkillValue(score);
    const normalizedConfidence = normalizeSkillValue(confidence);

    const existing = await UserSkill.findOne({
      userId,
      name,
    });

    if (!existing) {
      await UserSkill.create({
        userId,
        name,
        score: normalizedScore,
        confidence: normalizedConfidence,
        level: calculateLevel(normalizedScore),
        interviewsAppeared: 1,
        lastPracticed: new Date(),
      });

      continue;
    }

    existing.score = existing.score * (1 - alpha) + normalizedScore * alpha;

    existing.confidence =
      existing.confidence * (1 - alpha) + normalizedConfidence * alpha;

    existing.level = calculateLevel(existing.score);

    existing.interviewsAppeared += 1;

    existing.lastPracticed = new Date();

    await existing.save();
  }
}

export async function getUserSkills(userId) {
  return UserSkill.find({ userId }).sort({
    score: -1,
  });
}

function calculateLevel(score) {
  if (score >= 90) return 5;
  if (score >= 75) return 4;
  if (score >= 60) return 3;
  if (score >= 40) return 2;
  return 1;
}
