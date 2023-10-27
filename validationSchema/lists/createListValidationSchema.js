import { body } from "express-validator";

const createListValidationSchema = [
  body("name").exists().withMessage("List name is required"),
  body("description").optional(),
  body("location").exists().withMessage("Location is required"),
];
export { createListValidationSchema };
