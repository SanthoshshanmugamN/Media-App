import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

// Check if the model is already defined, else define it
export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
