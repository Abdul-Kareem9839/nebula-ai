import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Invalid input', parsed.error.flatten());

  const result = await authService.register(parsed.data);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Invalid input', parsed.error.flatten());

  const result = await authService.login(parsed.data);
  res.status(200).json({ success: true, ...result });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getById(req.userId);
  res.status(200).json({ success: true, user });
});
