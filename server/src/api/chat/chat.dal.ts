import Chat, { IChat } from "./chat.model";
import { JwtPayload } from "jsonwebtoken";
import User from "../user/user.model";

type CurrentUserIdType = string | JwtPayload | undefined;

class ChatDal {
  async findChat(currentUserId: CurrentUserIdType, chatUserId: string) {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: chatUserId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    const userChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    return userChat;
  }

  async createChat(chatInfo: IChat) {
    const chatCreated = await Chat.create(chatInfo);
    const fullChat = await Chat.findOne({
      _id: chatCreated._id,
    }).populate("users", "-password");
    return fullChat;
  }

  async findAllUsersChat(currentUserId: CurrentUserIdType) {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: currentUserId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    const allUserChats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    return allUserChats;
  }
}

export const chatDal = new ChatDal();
