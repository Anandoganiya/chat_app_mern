require("express-async-errors");
require("dotenv").config();
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { router } from "./api";
import { errorHandler } from "./middleware";
import User from "./api/user/user.model";
import { log } from "console";

const app: Application = express();
const PORT = Number(process.env.PORT) | 6000;

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/", router);
// app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: `http://127.0.0.1:5173`,
  },
});

io.on("connection", (socket: any) => {
  console.log("connected to socket------>>>>>>");

  socket.on("setup", (userData: any) => {
    socket.join(userData?.data?.data?._id);

    console.log("userData", userData?.data?.data?._id);
    socket.emit("connected");
  });

  socket.on("join room", (room: any) => {
    socket.join(room);
    console.log("user has join the room", room);
  });

  socket.on("new message", (newMessageReceived: any) => {
    log(newMessageReceived);
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.user not defined");

    chat.users.forEach((user: any) => {
      log("user", user);
      if (user._id === newMessageReceived.chat._id) return;
      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });
});
