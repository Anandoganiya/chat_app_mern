import { Request } from "express";
import { ErrorGenerator } from "../../utils";
import { chatDal } from "./chat.dal";

class ChatController {
  async accessChat(req: Request) {
    const { userId } = req.body;
    if (!userId) throw new ErrorGenerator(400, "User id is not provided");

    const userChat: any = await chatDal.findChat(req.userId, userId);

    if (userChat.length > 0) {
      return userChat[0];
    } else {
      let chatInfo = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.userId, userId],
      };
      try {
        const fullChat = await chatDal.createChat(chatInfo);
        return fullChat;
      } catch (error) {
        console.log(error);
        throw new ErrorGenerator(400, "Something went wrong!");
      }
    }
  }

  async fetchChat(req: Request) {
    const fetchUsers = await chatDal.findAllUsersChat(req.userId);
    return fetchUsers;
  }

  async createGroupChat(req: Request) {
    return req;
  }
}

export const chatController = new ChatController();
