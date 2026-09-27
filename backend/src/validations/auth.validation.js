import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail()
  ,
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
  ,
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password.").custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail()
  ,
  body("password")
    .notEmpty()
    .withMessage("Password is required."),

];