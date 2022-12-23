import { compare, hash } from "bcrypt";
import { Request } from "express";
import { userDal } from "./user.dal";
import { ErrorGenerator, jwtGenerator, ResultGenerator } from "../../utils";
import { IUser } from "./user.model";

class UserController {
  async userRegister(req: Request) {
    let {
      name,
      email,
      password,
      profileImage,
    }: { name: string; email: string; password: string; profileImage: string } =
      req.body;
    if (!name || !password || !email) {
      throw new ErrorGenerator(401, "Fields are required!");
    }
    const user = await userDal.findUserByEmail(email);
    if (user) {
      throw new ErrorGenerator(401, "User already registered!");
    }
    const passwordHash = await hash(password, 10);

    if (!profileImage) {
      profileImage = "https://i.stack.imgur.com/l60Hf.png";
    }

    const userData: IUser = {
      name,
      email,
      password: passwordHash,
      profileImage,
    };
    const registerUser: IUser = await userDal.createUser(userData);

    const token = await jwtGenerator.createJwt(String(registerUser._id));
    const result = new ResultGenerator(200, "register successful", {
      accessToken: token,
      data: registerUser,
    });
    return result;
  }

  async userLogin(req: Request) {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      throw new ErrorGenerator(401, "Fields are required!");
    }

    const user = await userDal.findUserByEmail(email);
    if (!user) {
      throw new ErrorGenerator(401, "User not registerd");
    }

    //password check
    const passwordCheck = await compare(password, user?.password);
    if (!passwordCheck) {
      throw new ErrorGenerator(401, "Invalid password");
    }

    const token = await jwtGenerator.createJwt(String(user._id));
    const result = new ResultGenerator(200, "login successful", {
      accessToken: token,
      data: user,
    });
    return result;
  }

  async userLogout(req: Request) {
    return req;
  }

  async getSearchUser(req: Request) {
    const { serach } = req.query;
    const keyword = serach
      ? {
          $or: [
            { name: { $regex: serach, $options: "i" } },

            { email: { $regex: serach, $options: "i" } },
          ],
        }
      : {};
    // @ts-ignore
    const users = await userDal.findUsers(keyword, req.userId);
    return users;
  }
}

export const userController = new UserController();
