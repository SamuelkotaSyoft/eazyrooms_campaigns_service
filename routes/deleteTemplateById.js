import axios from "axios";
import express from "express";
import * as fs from "firebase-admin/firestore";
import verifyToken from "../helpers/verifyToken.js";
import Template from "../models/templateModel.js";

var router = express.Router();
const fb = fs.getFirestore();

//new buyer
router.delete("/:templateId", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  //request payload
  const templateId = req.params.templateId;
  const role = req.user_info.role;

  //validate templateId
  if (!templateId) {
    res.status(400).json({ status: false, error: "templateId is required" });
    return;
  }

  try {
    if (role !== "propertyAdmin" && role !== "locationAdmin") {
      res.status(403).json({ status: false, error: "Unauthorized" });
      return;
    }
    //check if template exists
    const template = await Template.findById(templateId).exec();
    if (!template) {
      res.status(400).json({ status: false, error: "Invalid template" });
      return;
    }

    console.log({ template });

    /**
     *
     * get 360 dialog api key from firestore
     */
    let apiKey = process.env.WA_API_KEY;

    // await fb
    //   .collection("wa_key")
    //   .doc(uid)
    //   .get()
    //   .then((querySnapshot) => {
    //     // console.log("SNAPSHOT :>> ", querySnapshot.data());
    //     apiKey = querySnapshot.data().apiKey;
    //   })
    //   .catch((err) => {
    //     res.status(403).json(err);
    //   });

    /**
     *
     * delete template from 360 dialog
     */

    let deleteResult360Dialog = await axios({
      method: "delete",
      url: `https://waba.360dialog.io/v1/configs/templates/${template.name}`,
      headers: {
        "D360-API-KEY": apiKey,
      },
    });
    console.log({ deleteResult360DialogData: deleteResult360Dialog.data });
    console.log({ deleteResult360DialogError: deleteResult360Dialog.error });

    if (deleteResult360Dialog.status === 200) {
      //delete template
      const writeResult = await Template.deleteOne({ _id: templateId });
      //send response to client
      res.status(200).json({ status: true, data: writeResult });
    } else {
      res.status(400).json({
        status: false,
        error: "Error deleting template from 360 dialog",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
