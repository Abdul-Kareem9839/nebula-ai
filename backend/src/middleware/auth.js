import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new ApiError(401, "Authentication required");

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = payload.sub;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
});
