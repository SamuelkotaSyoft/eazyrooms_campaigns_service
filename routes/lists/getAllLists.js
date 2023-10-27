import express from "express";
import verifyToken from "../../helpers/verifyToken.js";

const router = express.Router();

//import models
import List from "../../models/listModel.js";
import User from "../../models/userModel.js";
import bookingModel from "../../models/bookingModel.js";
import listModel from "../../models/listModel.js";
import { getAllListValidationSchema } from "../../validationSchema/lists/getAllListValidationSchema.js";
import { validateRequest } from "../../helpers/validatorErrorHandling.js";

//get all chatbots
router.get(
  "/:locationId",
  getAllListValidationSchema,
  validateRequest,
  verifyToken,
  async function (req, res) {
    const uid = req.user_info.main_uid;

    const location = req.params.locationId;
    const role = req.user_info.role;

    try {
      if (role !== "propertyAdmin" && role !== "locationAdmin") {
        res.status(403).json({ status: false, error: "Unauthorized" });
        return;
      }
      //check if user exists
      const user = await User.findOne({ uid: uid });
      if (!user) {
        res.status(400).json({ status: false, error: "Invalid user" });
        return;
      }

      //query
      let query = List.find({
        location,
      });

      //execute query
      const queryResult = await query.exec();
      const activeGuestList = queryResult.find(
        (list) => list.editable === false
      );

      const bookings = await bookingModel
        .find({
          location,
          checkInDateTime: { $lte: new Date() },
          checkOutDateTime: { $gte: new Date() },
        })
        .populate("guests");
      let activeGuests = [];
      bookings.forEach((booking) => {
        let guests = booking.guests?.map((guest) => ({
          name: guest?.name,
          email: guest?.email,
          phoneNumber: guest?.phoneNumber,
        }));
        activeGuests = [...activeGuests, ...guests];
      });
      console.log({ activeGuests });
      let writableList;
      if (activeGuestList) {
        writableList = await listModel.findOneAndUpdate(
          {
            _id: activeGuestList?._id,
          },
          {
            contacts: activeGuests,
          }
        );
      } else {
        const list = new listModel({
          name: "Active Guests",
          description: "List of active guests",
          location,
          editable: false,
          contacts: activeGuests,
          user: user?._id,
        });
        writableList = await list.save();
      }

      //return result
      res.status(200).json({
        status: true,
        data: [
          ...queryResult?.filter((name) => name.editable === true),
          writableList,
        ],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, error: err });
    }
  }
);

export default router;
