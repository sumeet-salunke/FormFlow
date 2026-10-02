import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { submitResponse, getFormResponses, deleteResponse, deleteAllResponses, updateResponse, getResponse } from "../controllers/response.controller.js";
import { submissionLimiter } from "../middlewares/rateLimiter.js";

const router = Router();


router.post("/public/:publicId", submissionLimiter, submitResponse);

router.get("/form/:formId", authenticate, getFormResponses);

router.patch("/:responseId", authenticate, updateResponse);

router.get("/:responseId", authenticate, getResponse);

router.delete("/:responseId", authenticate, deleteResponse);

router.delete("/form/:formId", authenticate, deleteAllResponses);

export default router;
