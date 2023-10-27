import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Campaign from "../models/campaignModel.js";
import User from "../models/userModel.js";

const router = express.Router();

router.delete("/:campaignId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //request payload
  const campaignId = req.params.campaignId;
  const role = req.user_info.role;

  //validate campaignId
  if (!campaignId) {
    res.status(400).json({ status: false, error: "campaignId is required" });
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

    //check if campaign exists
    const campaign = Campaign.findById(campaignId);
    if (!campaign) {
      res.status(400).json({ status: false, error: "Invalid campaign" });
      return;
    }

    //delete
    const writeResult = await Campaign.deleteOne({ _id: campaignId });

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
