import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import "./firebase-config.js";
import "./models/locationModel.js";
import "./models/guestModel.js";

const app = express();
const port = 3006;

app.use(cors());
app.use(express.json());

/**
 *
 * dotenv config
 */
const __dirname = path.resolve();
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

/**
 *
 * connect to mongodb
 */
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
console.log("MONGODB CONNECTED...");

/**
 *
 * routes
 */

app.use(
  "/createTemplate",
  (await import("./routes/createTemplate.js")).default
);

app.use(
  "/getAllTemplates",
  (await import("./routes/getAllTemplates.js")).default
);

app.use(
  "/getTemplateById",
  (await import("./routes/getTemplateById.js")).default
);

app.use(
  "/updateTemplateById",
  (await import("./routes/updateTemplateById.js")).default
);

app.use(
  "/deleteTemplateById",
  (await import("./routes/deleteTemplateById.js")).default
);

app.use(
  "/syncTemplatesWith360Dialog",
  (await import("./routes/syncTemplatesWith360Dialog.js")).default
);

app.use(
  "/createCampaign",
  (await import("./routes/createCampaign.js")).default
);

app.use(
  "/getAllCampaigns",
  (await import("./routes/getAllCampaigns.js")).default
);

app.use(
  "/getCampaignById",
  (await import("./routes/getCampaignById.js")).default
);

app.use(
  "/updateCampaignById",
  (await import("./routes/updateCampaignById.js")).default
);

app.use(
  "/deleteCampaignById",
  (await import("./routes/deleteCampaignById.js")).default
);

app.use(
  "/sendTransactionalEmail",
  (await import("./routes/sendTransactionalEmail.js")).default
);

app.use(
  "/sendTransactionalWAMessage",
  (await import("./routes/sendTransactionalWAMessage.js")).default
);

app.use(
  "/getAllLists",
  (await import("./routes/lists/getAllLists.js")).default
);
app.use("/createList", (await import("./routes/lists/createList.js")).default);
app.use(
  "/deleteListById",
  (await import("./routes/lists/deleteListById.js")).default
);
app.use(
  "/getListById",
  (await import("./routes/lists/getListById.js")).default
);
app.use(
  "/updateListById",
  (await import("./routes/lists/updateListById.js")).default
);
app.use(
  "/updateListContacts",
  (await import("./routes/lists/updateListContacts.js")).default
);
app.use(
  "/deleteListContact",
  (await import("./routes/lists/deleteListContact.js")).default
);

app.use("/createKey", (await import("./routes/waKey/createKey.js")).default);

app.use("/getKey", (await import("./routes/waKey/getKey.js")).default);
app.use("/deleteKey", (await import("./routes/waKey/deleteKey.js")).default);
/**
 *
 * start listening to requests
 */
app.listen(port, () => {
  console.log(`Campaigns service listening on port ${port}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Campaign Service" });
});
