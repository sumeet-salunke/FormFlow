import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation } from "../validations/auth.validation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);

router.post("/login", loginValidation, validateRequest, login);

export default router;