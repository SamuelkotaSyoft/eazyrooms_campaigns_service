import mongoose from "mongoose";

const listSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Location",
  },
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  name: {
    type: String,
    maxLength: 30,
  },
  description: {
    type: String,
    maxLength: 500,
  },

  contacts: {
    type: Array,
  },
});

export default mongoose.model("List", listSchema);
