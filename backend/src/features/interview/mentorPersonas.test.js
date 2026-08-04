import test from "node:test";
import assert from "node:assert/strict";
import { buildInterviewSystemPrompt } from "./mentorPersonas.js";

test("buildInterviewSystemPrompt includes resume-aware guidance for resume mode", () => {
  const prompt = buildInterviewSystemPrompt({
    personality: "friendly",
    role: "Frontend Developer",
    skillLevel: "intermediate",
    type: "technical",
    mode: "resume",
    resumeAnalysis: {
      skills: ["React"],
      projects: ["Nebula"],
      experience: ["2 years"],
    },
  });

  assert.match(prompt, /resume-based/i);
  assert.match(prompt, /React/i);
  assert.match(prompt, /Nebula/i);
  assert.match(prompt, /Tell me about yourself/i);
});
