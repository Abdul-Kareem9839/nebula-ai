// --- CONNECTIONS CONFIG & HELPER ---
export const SKILL_RELATIONS = [
  ["JavaScript", "React"],
  ["React", "Next.js"],
  ["Node.js", "Express"],
  ["Express", "MongoDB"],
  ["Prompt Engineering", "LLMs"],
  ["LLMs", "RAG"],
  ["JavaScript", "Node.js"],
];

export function normalizeConfidence(confidence, score) {
  if (typeof confidence === "number" && Number.isFinite(confidence)) {
    return Math.min(1, Math.max(0, confidence));
  }

  if (typeof score === "number" && Number.isFinite(score)) {
    return Math.min(1, Math.max(0, score / 100));
  }

  return 0;
}

export const TIER_CONFIG = {
  excellent: {
    color: "#fbbf24",
    ring: 1,
    baseSize: 52,
    glow: "0 0 25px rgba(251,191,36,0.6)",
    label: "Excellent",
  },
  high: {
    color: "#ec4899",
    ring: 2,
    baseSize: 44,
    glow: "0 0 20px rgba(236,72,153,0.5)",
    label: "High",
  },
  medium: {
    color: "#a855f7",
    ring: 3,
    baseSize: 36,
    glow: "0 0 16px rgba(168,85,247,0.4)",
    label: "Medium",
  },
  low: {
    color: "#38bdf8",
    ring: 4,
    baseSize: 28,
    glow: "0 0 10px rgba(56,189,248,0.3)",
    label: "Needs Practice",
  },
};

export function getTier(confidence) {
  if (confidence >= 0.85) return "excellent";
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}
