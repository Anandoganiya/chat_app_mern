import mongoose from "mongoose";

const messagesModel = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, trim: true },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

export interface IMessage {
  sender?: string;
  content?: string;
  chat?: string;
}

const Messages = mongoose.model("Message", messagesModel);
export default Messages;
