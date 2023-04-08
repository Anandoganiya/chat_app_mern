import express, { Request, Response } from "express";
import Multer from "multer";
import { userController } from "./user.controller";
import { authUser } from "../../middleware/authentication";
export const router = express.Router();

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // max size of file is 5mb
  },
});

router.post("/user-register", async (req: Request, res: Response) => {
  const result = await userController.userRegister(req);
  res.json(result);
});

router.post(
  "/upload/profile-image",
  multer.single("imgFile"),
  async (req: Request, res: Response) => {
    const result = await userController.setProfileImage(req);
    res.json(result);
  }
);
router.post("/user-login", async (req: Request, res: Response) => {
  const result = await userController.userLogin(req);
  res.json(result);
});
router.post("/user-logout", async (req: Request, res: Response) => {
  const result = await userController.userLogout(req);
  res.json(result);
});
router.get(
  "/",
  authUser.authenticateUser,
  async (req: Request, res: Response) => {
    const result = await userController.getSearchUser(req);
    res.json(result);
  }
);
