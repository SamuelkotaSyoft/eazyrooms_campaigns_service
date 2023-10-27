import locationModel from "../../models/locationModel.js";
import { param } from "express-validator";
const getAllListValidationSchema = [
  param("locationId").custom(async (locationId) => {
    const location = await locationModel.findOne({ _id: locationId });
    if (!location) {
      throw new Error("Invalid location");
    }
  }),
];

export { getAllListValidationSchema };
