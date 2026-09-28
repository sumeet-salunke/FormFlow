import express from "express";
import { createForm, getMyForms, updateForm, getForm } from "../controllers/form.controller.js";
import { createFormValidation, updateFormValidation } from "../validations/form.validation.js";
import validateRequest from "../middlewares/validateRequest.js";
import authenticate from "../middlewares/authenticate.js";


const router = express.Router();

//create form
router.post("/", authenticate, createFormValidation, validateRequest, createForm);

//get forms
router.get("/", authenticate, getMyForms);

//update form
router.patch("/:formId", authenticate, updateFormValidation, validateRequest, updateForm);

router.get("/:formId", authenticate, getForm);

export default router;