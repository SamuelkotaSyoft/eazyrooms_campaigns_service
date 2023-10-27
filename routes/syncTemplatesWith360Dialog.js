import axios from "axios";
import express from "express";
import * as fs from "firebase-admin/firestore";
import verifyToken from "../helpers/verifyToken.js";
import Template from "../models/templateModel.js";
import User from "../models/userModel.js";

const fb = fs.getFirestore();

const router = express.Router();

//sync templates with 360 dialog
router.post("/:locationId", async function (req, res) {
  const locationId = req.params.locationId;

  try {
    //check if user exists

    /**
     *
     * get templates stored in mongodb
     */
    let templates = await Template.find({ location: locationId }).exec();

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
    //     apiKey = querySnapshot.data().apiKey;
    //   })
    //   .catch((err) => {
    //     res.status(403).json(err);
    //   });

    /**
     *
     * get templates stored in 360 dialog
     */
    const templatesFrom360Dialog = await axios.get(
      `https://waba.360dialog.io/v1/configs/templates`,
      {
        headers: {
          "D360-API-KEY": apiKey,
        },
      }
    );

    /**
     *
     * sync templates to match status
     */
    templates.forEach(async (template) => {
      const templateFrom360Dialog =
        templatesFrom360Dialog.data.waba_templates.find(
          (templateFrom360Dialog) =>
            templateFrom360Dialog.name === template.name
        );

      if (templateFrom360Dialog) {
        const updateResult = await Template.updateOne(
          { _id: template._id },
          {
            $set: {
              templateStatus: templateFrom360Dialog.status,
            },
          },
          { new: true }
        );
        console.log("updateResult :>> ", updateResult);
      }
    });

    //return result
    res.status(200).json({ status: true, data: templates });
  } catch (err) {
    res.status(404).json({ status: false, error: err });
  }
});

export default router;
