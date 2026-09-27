import { Router } from "express";
import { register, login, getCurrentUser, logout } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import validateRequest from "../middlewares/validateRequest.js";

import authenticate from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);

router.post("/login", loginValidation, validateRequest, login);

router.get("/me", authenticate, getCurrentUser)

router.post("/logout", authenticate, logout);

export default router;