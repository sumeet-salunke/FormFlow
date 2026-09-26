import { validationResult } from "express-validator";
import ApiError from "../helpers/ApiError.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed.", "VALIDATION_FAILED", errors.array());
  }
  next();
};

export default validateRequest;