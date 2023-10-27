import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

var router = express.Router();

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";

//get user by id
router.get("/:listId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //payload
  const listId = req.params.listId;

  const role = req.user_info.role;

  //validate orderId
  if (!listId) {
    return res.status(400).json({ status: false, error: "listId is required" });
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
    //query
    let query = List.findOne({ _id: listId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
