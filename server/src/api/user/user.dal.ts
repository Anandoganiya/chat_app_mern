import User from "./user.model";

class UserDal {
  async findUserByEmail(email?: string) {
    const user = await User.findOne({ email });
    return user;
  }
  async createUser(userData: any) {
    const user = await User.create(userData);
    return user;
  }
  async findUserById(userId: any) {
    const user = await User.findById(userId).select("-password");
    return user;
  }
  async findUsers(keyword: any, userId: string) {
    const users = await User.find(keyword).find({ _id: { $ne: userId } });
    return users;
  }
}

export const userDal = new UserDal();
