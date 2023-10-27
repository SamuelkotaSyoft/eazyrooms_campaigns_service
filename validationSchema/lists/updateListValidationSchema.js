import { body } from "express-validator";
import listModel from "../../models/listModel.js";

const updateListValidationSchema = [
  body("phoneNumbers")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage(
      "phoneNumbers must be an array of phone numbers and should be greater than 0"
    ),
  body("listId")
    .custom(async (listId) => {
      const isValidList = await listModel.findOne({ _id: listId });
      if (!isValidList) {
        throw new Error("Invalid listId");
      }
    })
    .withMessage("listId is required"),
  body("name").optional(),
  body("description").optional(),
];

export { updateListValidationSchema };
