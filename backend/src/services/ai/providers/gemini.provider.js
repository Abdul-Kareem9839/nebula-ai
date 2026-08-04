import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/env.js";
import { ApiError } from "../../../utils/ApiError.js";

const ai = new GoogleGenAI({
  apiKey: env.gemini.apiKey,
});

function normalizeMessages(messages) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

async function chat({
  messages,
  systemPrompt,
  temperature = 0.7,
  maxOutputTokens = 2048,
}) {
  try {
    const response = await ai.models.generateContent({
      model: env.gemini.model,

      contents: normalizeMessages(messages),

      config: {
        systemInstruction: systemPrompt,
        temperature,
        maxOutputTokens,
      },
    });

    return {
      content: response.text,

      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
        completionTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
      },

      finishReason: response.candidates?.[0]?.finishReason ?? "UNKNOWN",

      model: env.gemini.model,

      raw: response,
    };
  } catch (error) {
    throw new ApiError(502, `Gemini chat failed: ${error.message}`);
  }
}

async function embed(text) {
  try {
    const response = await ai.models.embedContent({
      model: env.gemini.embedModel,

      contents: text,
    });

    return response.embeddings?.[0]?.values ?? [];
  } catch (error) {
    throw new ApiError(502, `Gemini embedding failed: ${error.message}`);
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

  const result = parseJSON(response.content);

  return {
    evaluation:
      typeof result.evaluation === "object" && result.evaluation !== null
        ? result.evaluation
        : {
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

async function healthCheck() {
  try {
    await ai.models.generateContent({
      model: env.gemini.model,

      contents: "Hello",
    });

    return true;
  } catch {
    return false;
  }
}

export const geminiProvider = {
  chat,
  embed,
  healthCheck,
  evaluateAnswer,
  summarizeInterview,
};
