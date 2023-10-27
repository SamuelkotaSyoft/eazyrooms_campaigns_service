import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Campaign from "../models/templateModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//new buyer
router.patch("/", verifyToken, async function (req, res) {
  //request payload
  const uid = req.user_info.main_uid;
  const { campaignId, name, description, channel, contactLists } = req.body;

  const role = req.user_info.role;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "userId is required" });
    return;
  }

  //validate quantity
  if (!campaignId) {
    res.status(400).json({ status: false, error: "addressId is required" });
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
      res.status(400).json({ status: false, error: "Invalid userId" });
      return;
    }

    //check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      res.status(400).json({ status: false, error: "Invalid campaign" });
    }

    //update user
    const writeResult = await Campaign.updateOne(
      { _id: campaignId },
      {
        $set: {
          name: name,
          description: description,
          channel: channel,
          contactLists: contactLists,
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
