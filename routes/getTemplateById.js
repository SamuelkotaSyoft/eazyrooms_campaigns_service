import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Template from "../models/templateModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//get user by id
router.get("/:templateId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //payload
  const templateId = req.params.templateId;
  const role = req.user_info.role;

  //validate templateId
  if (!templateId) {
    res.status(200).json({ status: false, error: "templateId is required" });
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
    //query
    let query = Template.findOne({ _id: templateId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(500).json({ status: false, error: err });
  }
});

export default router;
