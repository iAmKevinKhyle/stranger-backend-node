import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  index: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  partner: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  chat: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
      required: false,
    },
  ],
});

export default mongoose.model("User", userSchema);
