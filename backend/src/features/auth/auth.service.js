import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './user.model.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

function signToken(userId) {
  return jwt.sign({}, env.jwtSecret, { subject: String(userId), expiresIn: env.jwtExpiresIn });
}

export async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  return { token: signToken(user._id), user: toPublicUser(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  return { token: signToken(user._id), user: toPublicUser(user) };
}

export async function getById(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return toPublicUser(user);
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    targetRole: user.targetRole,
    skillLevel: user.skillLevel,
    resumeUrl: user.resumeUrl,
  };
}
