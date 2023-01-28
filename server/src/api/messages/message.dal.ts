import Message, { IMessage } from "./messages.model";
import User from "../user/user.model";
import Chat from "../chat/chat.model";

class MessageDal {
  async createMessage(newMessage: IMessage) {
    const message = await Message.create(newMessage);
    const populateData = await (
      await message.populate("sender", "name pic")
    ).populate("chat");
    const userMessage = await User.populate(populateData, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(newMessage.chat, {
      latestMessage: userMessage,
    });
    return userMessage;
  }
  async findAllMessages(chatId: string) {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    return messages;
  }
}

export const messageDal = new MessageDal();
