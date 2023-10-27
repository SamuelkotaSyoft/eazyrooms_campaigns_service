import mongoose from "mongoose";

const storingKeySchema = new mongoose.Schema(
  {
    apikey: {
      type: String,
      required: true,
    },
    keyType: {
      type: String,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Location",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StoringKey", storingKeySchema);
// have to get here for adding the update.
