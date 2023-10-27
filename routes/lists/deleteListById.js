import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";

const router = express.Router();
// const bcrypt = require("bcrypt");

router.delete("/:listId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //request payload
  const listId = req.params.listId;

  const role = req.user_info.role;

  //validate listId
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
      res.status(400).json({ status: false, error: "Invalid user" });
      return;
    }

    //check if list exists
    const list = List.findById(listId);
    if (!list) {
      res.status(400).json({ status: false, error: "Invalid list" });
      return;
    }

    //delete
    const writeResult = await List.deleteOne({ _id: listId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
