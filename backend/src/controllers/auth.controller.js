import ApiResponse from "../helpers/ApiResponse.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../helpers/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json(new ApiResponse(201, result.message, result.data));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  req.session.userId = result.data.id;
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.userId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});