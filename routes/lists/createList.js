import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";
import { createListValidationSchema } from "../../validationSchema/lists/createListValidationSchema.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";

//create chatbot
router.post(
  "/",
  createListValidationSchema,
  validateRequest,
  verifyToken,
  async function (req, res) {
    const requestData=matchedData(req)
    const uid = req.user_info.main_uid;

    const role = req.user_info.role;

    //validate userId
    if (!uid) {
      res.status(400).json({ status: false, error: "uid is required" });
      return;
    }

    try {
      if (role !== "propertyAdmin" && role !== "locationAdmin") {
        res.status(403).json({ status: false, error: "Unauthorized" });
        return;
      }
      //check if user exists
      const user = await User.findOne({ uid: uid });
      if (!user) {
        // console.log("NO USER");
        res.status(400).json({ status: false, error: "Invalid userId" });
        return;
      }

      //add address
      const list = new List({
        user: user._id,
        ...requestData,
      });

      //save
      const writeResult = await list.save();

      //send response to client
      res.status(200).json({ status: true, data: writeResult });
    } catch (err) {
      res.status(404).json({ error: err });
    }
  }
);

export default router;
