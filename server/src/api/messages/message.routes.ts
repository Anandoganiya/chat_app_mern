import express, { Request, Response } from "express";
import { messageController } from "./message.controller";
import { authUser } from "../../middleware/authentication";
export const router = express.Router();

router.post(
  "/",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await messageController.sendMessage(req);
    res.json(result);
  }
);
router.get("/:chatId", async (req: Request, res: Response) => {
  const result = await messageController.allMessages(req);
  res.json(result);
});
