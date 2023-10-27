import express from "express";
import storingKeyModel from "../../models/storingKey.model.js";
import verifyToken from "../../helpers/verifyToken.js";
const router = express.Router();

router.delete("/", verifyToken, async (req, res) => {
  try {
    const id = req.body.org;
    // let organisationId;
    // (req.headers['orgid']) ? organisationId = req.headers['orgid'] : organisationId = '787a8ds21b12-adsaj12';
    // const deleteKeyResponse = await storingKeyModel.deleteOne({
    //     Org : organisationId
    // });
    const result = await storingKeyModel.deleteOne({ Org: id });
    // const result = await storingKeyModel.updateOne({ Org : req.user.org }, { $set: { addto: false }});
    res.status(200).json({ status: true, data: "apikeys deleted" });
  } catch (error) {
    return res
      .status(400)
      .json({ status: false, error: "error deleting apikeys" });
  }
});

export default router;
