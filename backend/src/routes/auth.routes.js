import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidation } from "../validations/auth.validation.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.post("/register", registerValidation, validateRequest, register);

export default router;