import axios from "axios";
import express from "express";
import verifyToken from "../helpers/verifyToken.js";
import Campaign from "../models/campaignModel.js";
import User from "../models/userModel.js";

var router = express.Router();

//create chatbot
router.post("/", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;
  const {
    name,
    description,
    channel,
    templateId,
    lists,
    locationId,
    scheduleDateTime,
    headerVariable,
    bodyVariables,
  } = req.body;

  //validate userId
  if (!uid) {
    res.status(400).json({ status: false, error: "uid is required" });
    return;
  }

  //validate name
  if (!name) {
    res.status(400).json({ status: false, error: "name is required" });
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
    const campaign = new Campaign({
      property: user.property,
      location: locationId,
      name: name,
      description: description,
      channel: channel,
      campaignStatus: "pending",
      lists: lists,
      dateTime: scheduleDateTime,
      template: templateId,
      variables: {
        header: [headerVariable],
        body: bodyVariables,
      },
      status: true,
    });

    //save
    const writeResult = await campaign.save();

    if (writeResult && scheduleDateTime) {
      //schedule campaign
      let scheduleRes = await axios.post(
        `${process.env.API_GATEWAY}/api/v1/campaignLauncherService/scheduleCampaign`,
        {
          campaignId: writeResult._id,
          scheduleDateTime: new Date(scheduleDateTime),
        },
        {
          headers: {
            "eazyrooms-token": req.headers["eazyrooms-token"],
          },
        }
      );

      console.log({ scheduleRes });
    }

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

export default router;
