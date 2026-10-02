import { Router } from "express";
import { register, login, getCurrentUser, logout, editProfile, changePassword, deleteAccount } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation, editProfileValidation, changePasswordValidation } from "../validations/auth.validation.js";
import validateRequest from "../middlewares/validateRequest.js";
import authenticate from "../middlewares/authenticate.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, registerValidation, validateRequest, register);

router.post("/login", authLimiter, loginValidation, validateRequest, login);

router.get("/me", authenticate, getCurrentUser);

router.post("/logout", authenticate, logout);

router.patch("/me", authenticate, editProfileValidation, validateRequest, editProfile);

router.patch("/password", authLimiter, authenticate, changePasswordValidation, validateRequest, changePassword);

router.delete("/me", authenticate, deleteAccount);

export default router;