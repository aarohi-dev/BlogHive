import { body, validationResult } from "express-validator";

//Post validation
export const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),
  body("content")
    .isLength({ min: 1 })
    .withMessage("Content cannot be empty"),
];

//Comment validation
export const validateComment = [
  body("content")
    .isLength({ min: 1 })
    .withMessage("Comment cannot be empty"),
];

//Centralized error handler
export const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Returns 400 with array of validation issues
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};
