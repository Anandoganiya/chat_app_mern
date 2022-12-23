import express from "express";
import { userRouter } from "./user";
import { chatRouter } from "./chat";

export const router = express.Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);
