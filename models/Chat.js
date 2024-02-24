import mongoose, { modelNames } from "mongoose";

const Schema = mongoose.Schema;

const chatShema = new Schema({
  owners: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [
    {
      user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      user_message: {
        type: String,
        required: false,
      },
    },
  ],
});

export default mongoose.model("Chat", chatShema);
