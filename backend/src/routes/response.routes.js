import { Router } from "express";

import { submitResponse } from "../controllers/response.controller.js";

const router = Router();


router.post("/public/:publicId", submitResponse);




export default router;
