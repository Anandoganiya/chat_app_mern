import { Request } from "express";
import { messageDal } from "./message.dal";
import { ErrorGenerator } from "../../utils";
import { IMessage } from "./messages.model";

class MessageController {
  async sendMessage(req: Request) {
    const { chatId, content } = req.body;
    if (!chatId || !content) {
      throw new ErrorGenerator(400, "Invalid data passed into request");
    }
    let newMessage: IMessage = {
      sender: req.userId,
      content,
      chat: chatId,
    };
    try {
      const message = await messageDal.createMessage(newMessage);
      return message;
    } catch (error) {
      console.log(error);
      throw new ErrorGenerator(400, "Something went wrong!");
    }
  }

  async allMessages(req: Request) {
    const { chatId } = req.params;
    try {
      const messages = await messageDal.findAllMessages(chatId);
      return messages;
    } catch (error) {
      console.log(error);
      throw new ErrorGenerator(400, "Something went wrong!");
    }
  }
}

export const messageController = new MessageController();
