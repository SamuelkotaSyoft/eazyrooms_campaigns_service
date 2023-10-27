import axios from "axios";
import express from "express";
import * as fs from "firebase-admin/firestore";
import verifyToken from "../helpers/verifyToken.js";
import Template from "../models/templateModel.js";
import User from "../models/userModel.js";

const fb = fs.getFirestore();

var router = express.Router();

//import models

//create chatbot
router.post("/", verifyToken, async function (req, res) {
  const uid = req.user_info.main_uid;
  const role = req.user_info.role;

  const {
    name,
    language,
    category,
    type,
    components,
    locationId,
    description,
    subCategory,
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

    /**
     *
     *
     * upload file to whatsapp to get media id
     */

    let apiKey = process.env.WA_API_KEY;
    // let mediaId;

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

    // if (fileUrl && fileUrl !== "") {
    //   const fileContents = await axios.get(fileUrl, {
    //     responseType: "arraybuffer",
    //   });

    //   const buffer = Buffer.from(fileContents.data, "buffer");

    //   const fileTypeBuffer = await fileTypeFromBuffer(buffer);

    //   const mime = fileTypeBuffer.mime;

    //   await axios
    //     .post(
    //       "https://waba.360dialog.io/v1/media/",
    //       Buffer.from(buffer, "buffer"),
    //       {
    //         headers: {
    //           "D360-API-KEY": apiKey,
    //           "Content-Type": mime,
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       mediaId = response.data.media[0].id;
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }

    let templateData = {
      name,
      language,
      category,
      type,
      components,
    };

    let saveTemplateResult = await axios({
      method: "post",
      url: "https://waba.360dialog.io/v1/configs/templates",
      data: templateData,
      headers: {
        "D360-API-KEY": apiKey,
      },
    });

    console.log({ saveTemplateResult });

    //add address
    const template = new Template({
      property: user.property,
      location: locationId,
      name: name,
      category: category,
      language: language,
      type: type,
      description: description,
      subCategory: subCategory,
      components: components,
      namespace: saveTemplateResult.data.namespace,
      templateStatus: saveTemplateResult.data.status,
    });

    //save
    const writeResult = await template.save();

    //send response to client
    res.status(200).json({ status: true, data: writeResult });
    return;
  } catch (err) {
    res.status(500).json({ error: err });
    return;
  }
});

export default router;
