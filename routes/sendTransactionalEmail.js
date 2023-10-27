import express from "express";
const router = express.Router();
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer from "nodemailer";

const templatesList = {
  precheckinTemplate: "./emailTemplates/guestPrecheckinEmailTemplate.html",
  orderConfirmTemplate: "./emailTemplates/orderConfirmEmailTemplate.html",
  orderRejectTemplate: "./emailTemplates/orderRejectEmailTemplate.html",
  adminWelcomeTemplate: "./emailTemplates/adminWelcomeEmailTemplate.html",
  orderStatusTemplate: "./emailTemplates/orderStatusEmailTemplate.html",
  emailVerifyTemplate: "./emailTemplates/emailVerifyEmailTemplate.html",
};

router.post("/", (req, res) => {
  try {
    const { email, subject, templateName, variables } = req.body;
    const __dirname = path.resolve();

    let filePath = "";

    if (templateName === "precheckinTemplate") {
      filePath = path.join(__dirname, templatesList.precheckinTemplate);
    } else if (templateName === "orderConfirmTemplate") {
      filePath = path.join(__dirname, templatesList.orderConfirmTemplate);
    } else if (templateName === "orderRejectTemplate") {
      filePath = path.join(__dirname, templatesList.orderRejectTemplate);
    } else if (templateName === "adminWelcomeTemplate") {
      filePath = path.join(__dirname, templatesList.adminWelcomeTemplate);
    } else if (templateName === "orderStatusTemplate") {
      filePath = path.join(__dirname, templatesList.orderStatusTemplate);
    } else if (templateName === "emailVerifyTemplate") {
      filePath = path.join(__dirname, templatesList.emailVerifyTemplate);
    }

    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = variables;
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Eazyrooms <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      // text: `Hi,\n\n Your booking has been created successfully. For Faster Checkins please use the form link below. https://precheckin.eazyrooms.com/${bookingId} \n\n \n\n Thank you!`,
      html: htmlToSend,
    };

    transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log(`Transactional email sent successfully to ${email}`);
        res.status(200).json({
          status: true,
          message: "Transactional email sent successfully",
        });
      })
      .catch((error) => {
        console.error(`Error sending Transactional email to ${email}`, error);
        res.status(500).json({ status: false, error: "unknown error" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error: "unknown error" });
  }
});

export default router;
