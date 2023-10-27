import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();
// import bcrypt from "bcrypt";

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";

//new buyer
router.patch("/", verifyToken, async function (req, res) {
  //request payload
  // const userId = req.auth.userId;
  const uid = req.user_info.main_uid;
  const { listId, name, phoneNumber } = req.body;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
    return;
  }

  //validate quantity
  if (!listId) {
    res.status(400).json({ status: false, error: "listId is required" });
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
    const list = await List.findById(listId);
    if (!list) {
      res.status(400).json({ status: false, error: "Invalid list" });
    }

    //update user
    const writeResult = await List.updateOne(
      { _id: listId },
      {
        $set: {
          contacts: [
            ...list.contacts,
            {
              name: name,
              phoneNumber: phoneNumber,
            },
          ],
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(404).json({ error: err });
  }
});

export default router;
