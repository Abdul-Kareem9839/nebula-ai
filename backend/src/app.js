import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./features/auth/auth.routes.js";
import interviewRoutes from "./features/interview/interview.routes.js";
import resumeRoutes from "./features/resume/resume.routes.js";
import skillRoutes from "./features/skills/skill.routes.js";

export const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

app.use("/api", apiLimiter);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running.",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skills", skillRoutes);

app.use(notFound);
app.use(errorHandler);
