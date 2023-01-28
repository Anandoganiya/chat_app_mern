import express from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";
import { messageRouter } from "./messages";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);
