import ApiResponse from "../helpers/ApiResponse.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../helpers/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json(new ApiResponse(201, result.message, result.data));
});