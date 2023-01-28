import Chat, { IChat } from "./chat.model";
import { JwtPayload } from "jsonwebtoken";
import User from "../user/user.model";

export type CurrentUserIdType = string | JwtPayload | undefined;

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

  async createGroupChat(
    groupUsers: string[],
    currentUserId: CurrentUserIdType,
    chatName: string
  ) {
    const groupChat = await Chat.create({
      chatName: chatName,
      users: groupUsers,
      isGroupChat: true,
      groupAdmin: currentUserId,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return fullGroupChat;
  }

  async findChatByIdAndUpateName(chatId: string, newChatName: string) {
    const updateChatName = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: newChatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return updateChatName;
  }
  async addUserToGroup(chatId: string, userId: string) {
    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return addUser;
  }
  async removeUserFromGroup(chatId: string, userId: string) {
    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return removeUser;
  }
}

export const chatDal = new ChatDal();
