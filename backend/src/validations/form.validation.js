import { body } from "express-validator";
import { AVAILABILITY_TYPES } from "../constants/form.constants.js";

export const createFormValidation = [
  body("title")
    .isString()
    .withMessage("Title must be string.")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 200 })
    .withMessage("Title is too long.")
  ,
  body("description")
    .isString()
    .withMessage("Description must be string.")
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description is too long."),
];

export const updateFormValidation = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string.")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be between 1 and 200 characters."),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string.")
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description is too long."),

  body("availability")
    .optional()
    .isIn(Object.values(AVAILABILITY_TYPES))
    .withMessage("Availability must be a string"),

  body("fields")
    .optional()
    .isArray()
    .withMessage("Fields must be an array."),
];