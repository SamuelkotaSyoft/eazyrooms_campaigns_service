import express from "express";
import verifyToken from "../../helpers/verifyToken.js";
import listModel from "../../models/listModel.js";
const router = express.Router();
router.delete("/:phoneNumber", async function (req, res) {
  try {
    const phoneNumber = req.params.phoneNumber;
    const listId = req.body.listId;
    const list = await listModel.findByIdAndUpdate(listId, {
      $pull: {
        contacts: {
          phoneNumber: phoneNumber,
        },
      },
    });
    res.status(200).json({ status: true, data: list });
  } catch (err) {
    console.log({ err });
    res.status(500).json({ error: err });
  }
});
export default router;
