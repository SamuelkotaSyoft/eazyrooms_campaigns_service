import express from "express";
const app = express();
const router = express.Router();
import bcrypt from "bcrypt";
import storingKeyModel from "../../models/storingKey.model.js";
import { body } from "express-validator";
import cors from "cors";
router.post("/", [body("apiKey").exists()], async (req, res) => {
  try {
    const apiKey = req.body.apikey;
    console.log("has", apiKey);
    const hashedApiKey = await bcrypt.hash(apiKey, 10);
    console.log(hashedApiKey);
    const storingKey = new storingKeyModel({
      // key : req.body.key,
      apikey: hashedApiKey,
      // addto : true,
      Org: req.body.Org,
      keyType: req.body.keyType,
    });
    const keyStored = await storingKey.save();
    res.status(200).json({ status: true, data: keyStored });
    // Response200(res,{status : true, data : keyStored});
  } catch (error) {
    res.status(400).json({
      status: false,
      error: `Invalid request and error saving due to ${error}`,
    });

    // Response400(res, `Invalid request and error saving due to ${error}`);
  }
});

export default router;
