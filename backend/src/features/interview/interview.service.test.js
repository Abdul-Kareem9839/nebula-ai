import test from "node:test";
import assert from "node:assert/strict";
import { buildFallbackInterviewSummary } from "./interview.service.js";

test("buildFallbackInterviewSummary returns a safe structure when AI summarization fails", () => {
  const interview = {
    turns: [
      {
        question: { text: "Tell me about yourself." },
        answer: { text: "I am a frontend developer with React experience." },
        evaluation: { score: 82, feedback: "Strong answer." },
      },
    ],
  };

  const summary = buildFallbackInterviewSummary(interview);

  assert.deepEqual(summary.summary.strengths, []);
  assert.deepEqual(summary.summary.weaknesses, []);
  assert.equal(summary.overallScore, 82);
  assert.equal(summary.technicalScore, 82);
  assert.equal(summary.communicationScore, 82);
  assert.equal(summary.problemSolvingScore, 82);
  assert.equal(summary.confidenceScore, 82);
  assert.equal(Array.isArray(summary.skills), true);
  assert.equal(summary.skills.length > 0, true);
  assert.equal(summary.skills[0].name, "React");
  assert.deepEqual(summary.ai, {});
});
