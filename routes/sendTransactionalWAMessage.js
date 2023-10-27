import express from "express";
const router = express.Router();
import axios from "axios";

router.post("/", async function (req, res) {
  try {
    const { templateName, variables, phoneNumber } = req.body;
    let requestBody = {
      to: phoneNumber,
      type: "template",
      template: {
        namespace: "952b8cae_4d9c_4b7a_b7fa_a60b44f7ea81",
        name: templateName,
        language: {
          code: "en",
          policy: "deterministic",
        },
        components: [
          {
            type: "body",
            parameters: Object.entries(variables).map(([key, value]) => {
              return {
                type: "text",
                text: value,
              };
            }),
          },
        ],
      },
    };

    let response = await axios.post(
      "https://waba.360dialog.io/v1/messages",
      requestBody,
      {
        headers: {
          "D360-API-KEY": process.env.WA_API_KEY,
        },
      }
    );

    res
      .status(200)
      .json({ status: true, message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
});

export default router;
