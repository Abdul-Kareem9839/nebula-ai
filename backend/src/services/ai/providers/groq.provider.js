import Groq from "groq-sdk";
import { env } from "../../../config/env.js";
import { ApiError } from "../../../utils/ApiError.js";

const groq = new Groq({
  apiKey: env.groq.apiKey,
});

async function chat({
  messages,
  systemPrompt,
  temperature = 0.7,
  maxOutputTokens = 2048,
}) {
  try {
    const response = await groq.chat.completions.create({
      model: env.groq.model,

      messages: [
        ...(systemPrompt
          ? [
              {
                role: "system",
                content: systemPrompt,
              },
            ]
          : []),

        ...messages,
      ],

      temperature,

      max_completion_tokens: maxOutputTokens,
    });

    return {
      content: response.choices?.[0]?.message?.content ?? "",

      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },

      finishReason: response.choices?.[0]?.finish_reason ?? "unknown",

      model: response.model,

      raw: response,
    };
  } catch (error) {
    throw new ApiError(502, `Groq chat failed: ${error.message}`);
  }
}

/**
 * Groq doesn't provide embeddings.
 * Embeddings should come from Gemini or Jina.
 */
async function embed() {
  throw new ApiError(501, "Embeddings are not supported by the Groq provider.");
}

async function healthCheck() {
  try {
    await groq.chat.completions.create({
      model: env.groq.model,

      messages: [
        {
          role: "user",
          content: "Hello",
        },
      ],

      max_completion_tokens: 5,
    });

    return true;
  } catch {
    return false;
  }
}

function parseJSON(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}

async function evaluateAnswer({ interview, answer }) {
  const response = await chat({
    systemPrompt: `
You are an expert technical interviewer.

Evaluate the candidate answer.

STRICT OUTPUT RULES:
1. Return ONLY JSON.
2. Do not use markdown.
3. Never return evaluation as a string.
4. evaluation MUST always be an object.
5. Always provide nextQuestion and nextDifficulty.

Required JSON format:

{
  "evaluation": {
    "score": 0,
    "feedback": "",
    "strengths": [],
    "weaknesses": []
  },
  "nextQuestion": "",
  "nextDifficulty": "easy|medium|hard"
}
`,
    messages: [
      {
        role: "user",
        content: `
Previous Interview Question:
${interview.turns[interview.turns.length - 1].question.text}

Candidate Answer:
${answer}

Evaluate the answer and generate the next interview question.
`,
      },
    ],
    temperature: 0.4,
  });

  console.log("RAW AI RESPONSE:", response.content);

  const result = parseJSON(response.content);

  return {
    evaluation:
      typeof result.evaluation === "object" && result.evaluation !== null
        ? result.evaluation
        : {
            status: result.evaluation || "unknown",
            score: 0,
            feedback: result.feedback || "",
            strengths: [],
            weaknesses: [],
          },

    nextQuestion:
      result.nextQuestion || "Can you explain your approach in more detail?",

    nextDifficulty: result.nextDifficulty || "medium",
  };
}

async function summarizeInterview(interview) {
  const response = await chat({
    systemPrompt: `
You are an expert interview evaluator.
Return only raw JSON with the exact keys: summary, overallScore, technicalScore, communicationScore, problemSolvingScore, confidenceScore, skills, ai.
The summary object must include strengths, weaknesses, and overallFeedback.
Do not use markdown.
If you cannot determine a value, return defaults: empty arrays, empty strings, and numeric values as 0.
`,
    messages: [
      {
        role: "user",
        content: `
Use the interview turns below to generate a single final evaluation for the candidate.

Return an object with keys:
- summary: { strengths, weaknesses, overallFeedback }
- overallScore
- technicalScore
- communicationScore
- problemSolvingScore
- confidenceScore
- skills
- ai

Interview turns:
${JSON.stringify(interview.turns, null, 2)}
`,
      },
    ],
    temperature: 0.25,
  });

  return parseJSON(response.content);
}

async function analyzeResume({ text }) {
  const response = await chat({
    systemPrompt: `
Return only raw JSON.
Do not use markdown.
The JSON must have these exact keys: skills, projects, experience, education, certifications, strengths, weaknesses.
`,
    messages: [
      {
        role: "user",
        content: text || "No resume text provided.",
      },
    ],
    temperature: 0.3,
  });

  return parseJSON(response.content);
}

export const groqProvider = {
  chat,
  embed,
  healthCheck,
  evaluateAnswer,
  summarizeInterview,
  analyzeResume,
};
