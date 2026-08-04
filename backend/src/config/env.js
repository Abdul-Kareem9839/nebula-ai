import "dotenv/config";

export const env = {
  // Server
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // Database
  mongoUri: process.env.MONGO_URI,

  // Authentication
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // AI
  aiProvider: process.env.AI_PROVIDER || "gemini",

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  },

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  },

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model:
      process.env.OPENROUTER_MODEL || "meta-llama/llama-3.1-8b-instruct:free",
  },

  // File Storage
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
};

// Fail early if important configuration is missing.
export function assertRequiredEnv() {
  const required = ["mongoUri", "jwtSecret"];

  const missing = required.filter((key) => !env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  validateAIProvider();
}

function validateAIProvider() {
  const providers = ["gemini", "groq", "openrouter"];

  if (!providers.includes(env.aiProvider)) {
    throw new Error(`Invalid AI_PROVIDER: ${env.aiProvider}`);
  }
}
