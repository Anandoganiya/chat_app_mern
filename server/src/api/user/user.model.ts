import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://i.stack.imgur.com/l60Hf.png",
    },
  },
  {
    timestamps: true,
  }
);

export interface IUser {
  _id?: any;
  name?: string;
  email: string;
  password: string;
  profileImage?: string;
}

const User = mongoose.model("User", userModel);
export default User;
