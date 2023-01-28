import express, { Request, Response } from "express";
import { chatController } from "./chat.controller";
import { authUser } from "../../middleware/authentication";
export const router = express.Router();

router.post(
  "/",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.accessChat(req);
    res.json(result);
  }
);

router.post(
  "/fetch-chat",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.fetchChat(req);
    res.json(result);
  }
);

router.post(
  "/create-groupchat",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.createGroupChat(req);
    res.json(result);
  }
);

router.put(
  "/rename-group",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.renameGroup(req);
    res.json(result);
  }
);

router.put(
  "/add-group",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.addToGroup(req);
    res.json(result);
  }
);

router.put(
  "/remove-group",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await chatController.removeFromGroup(req);
    res.json(result);
  }
);
