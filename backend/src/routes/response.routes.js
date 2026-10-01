import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { submitResponse, getFormResponses, deleteResponse, deleteAllResponses } from "../controllers/response.controller.js";

const router = Router();


router.post("/public/:publicId", submitResponse);

router.get("/form/:formId", authenticate, getFormResponses);

router.delete("/:responseId", authenticate, deleteResponse);

router.delete("/form/:formId", authenticate, deleteAllResponses);

export default router;
