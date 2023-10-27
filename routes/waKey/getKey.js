import express, { response } from "express";

// const jwt = require('jsonwebtoken');
const router = express.Router();
import storingKeyModel from "../../models/storingKey.model.js";
import verifyToken from "../../helpers/verifyToken.js";

router.get("/", verifyToken, async (req, res) => {
  try {
    // for jwt.
    // const decoded = jwt.verify(token, secret);
    // const organizationId = decoded.orgId;
    // let organisationId;
    const { org } = req.user;
    const apiKeyFromDB = await storingKeyModel.findOne({ Org: org });
    console.log(apiKeyFromDB);
    if (apiKeyFromDB.apikey != undefined || apiKeyFromDB != null) {
      res.status(200).json({ status: true, data: apiKeyFromDB });
      //   res.status(200).json({ status: true, data: apiKeyFromDB });
    }
    // (apiKeyFromDB.apikey)|| apiKeyFromDB != undefined ?Response200(res,"",{is_connected: true}): Response404(res,"",{is_connected: false});
  } catch (error) {
    res.status(400).json({
      status: false,
      error: `invalid request ${error}`,
    });
  }
});

export default router;
