import { Request } from "express";
import { ErrorGenerator } from "../../utils";
import { chatDal, CurrentUserIdType } from "./chat.dal";

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
    const groupUsers: any = req.body.users;
    const chatName: string = req.body.name;

    const currentUserId: CurrentUserIdType = req.userId;
    if (!groupUsers || !chatName) {
      throw new ErrorGenerator(400, "Please fill all the fields");
    }
    const users: string[] = JSON.parse(groupUsers);
    if (users.length < 2) {
      throw new ErrorGenerator(
        400,
        "More than 2 users are required to form a group"
      );
    }
    // @ts-ignore
    users.push(currentUserId);

    try {
      const groupChat = await chatDal.createGroupChat(
        users,
        currentUserId,
        chatName
      );
      return groupChat;
    } catch (error) {
      console.log(error);
      throw new ErrorGenerator(400, "Something went wrong!");
    }
  }

  async renameGroup(req: Request) {
    const { chatId, chatName } = req.body;
    const updateChatName = await chatDal.findChatByIdAndUpateName(
      chatId,
      chatName
    );
    if (!updateChatName) throw new ErrorGenerator(404, "Chat not found");
    else return updateChatName;
  }

  async addToGroup(req: Request) {
    const { chatId, userId } = req.body;
    const addUser = await chatDal.addUserToGroup(chatId, userId);
    if (!addUser) throw new ErrorGenerator(404, "Chat not found");
    return addUser;
  }
  async removeFromGroup(req: Request) {
    const { chatId, userId } = req.body;
    const removeUser = await chatDal.removeUserFromGroup(chatId, userId);
    if (!removeUser) throw new ErrorGenerator(404, "Chat not found");
    return removeUser;
  }
}

export const chatController = new ChatController();
