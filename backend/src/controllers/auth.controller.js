import ApiResponse from "../helpers/ApiResponse.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import AUTH from "../constants/auth.constants.js";

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

export const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.userId);

  //for express-sssion
  /*
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError(500, "Failed to logout", "SESSION_DESTROY_FAILED");
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({
      success: true,
      message: AUTH.MESSAGES.LOGOUT_SUCCESS,
      data: null,
    })
  })

*/
  req.session = null;
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const editProfile = asyncHandler(async (req, res) => {
  const result = await authService.editProfile(req.userId, req.body);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(req.userId, req.body);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const result = await authService.deleteAccount(req.userId);
  req.session = null;
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

/*
Login
  ↓
req.session = { userId: "123" }
  ↓
cookie-session creates "formflow_session"
  ↓
Browser stores cookie
  ↓
Authenticated requests
  ↓
Logout
  ↓
req.session = null
  ↓
Session cookie removed


*/