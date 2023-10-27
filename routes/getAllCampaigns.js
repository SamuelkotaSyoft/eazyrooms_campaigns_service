import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Campaign from "../models/campaignModel.js";
import User from "../models/userModel.js";

const router = express.Router();

//get all campaigns
router.get("/:locationId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  // console.log("UID >>>", uid);
  const role = req.user_info.role;
  const locationId = req.params.locationId;

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
    let query = Campaign.find({ location: locationId });

    //execute query
    const queryResult = await query.exec();

    //return result
    res.status(200).json({ status: true, data: queryResult });
  } catch (err) {
    res.status(404).json({ status: false, error: err });
  }
});

export default router;
