import express from "express";
import { createForm } from "../controllers/form.controller.js";
import { createFormValidation } from "../validations/form.validation.js";
import validateRequest from "../middlewares/validateRequest.js";
import authenticate from "../middlewares/authenticate.js";


const router = express.Router();

router.post("/", authenticate, createFormValidation, validateRequest, createForm);


export default router;