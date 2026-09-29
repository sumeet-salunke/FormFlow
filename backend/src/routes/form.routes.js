import express from "express";
import { createForm, getMyForms, updateForm, getForm, publishForm } from "../controllers/form.controller.js";
import { createFormValidation, updateFormValidation, publishFormValidation } from "../validations/form.validation.js";
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

router.post("/:formId/publish", authenticate, publishFormValidation, validateRequest, publishForm);

export default router;