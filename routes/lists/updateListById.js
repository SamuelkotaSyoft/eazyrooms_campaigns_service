import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();
// import bcrypt from "bcrypt";

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";
import { updateListValidationSchema } from "../../validationSchema/lists/updateListValidationSchema.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";
import { matchedData } from "express-validator";

//new buyer
router.patch(
  "/",
  updateListValidationSchema,
  validateRequest,
  verifyToken,
  async function (req, res) {
    const requestData = matchedData(req);
    //request payload
    // const userId = req.auth.userId;
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
        res.status(400).json({ status: false, error: "Invalid uid" });
        return;
      }

      //check if list exists

      const selectedList = await List.findOne({ _id: requestData.listId });
      const requestGuestPhones = requestData.phoneNumbers;
      let selectedPhoneNumbers = selectedList?.contacts?.map(
        (contact) => contact?.phoneNumber
      );
      let newGuests = [];
      requestGuestPhones?.contacts?.forEach((requestedContact) => {
        if (!selectedPhoneNumbers?.includes(requestedContact)) {
          newGuests.push(requestedContact);
        }
      });

      //update user
      const writeResult = await List.updateOne(
        { _id: requestData.listId },
        {
          $set: {
            ...requestData,
            contacts: [...selectedList.contacts, ...newGuests],
          },
        },
        { new: true }
      );

      res.status(200).json({ status: true, data: writeResult });
    } catch (err) {
      res.status(404).json({ error: err });
    }
  }
);

export default router;
