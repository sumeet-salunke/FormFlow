import { body } from "express-validator";

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