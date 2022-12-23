import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import { authUser } from "../../middleware/authentication";
export const router = express.Router();

router.post("/user-register", async (req: Request, res: Response) => {
  const result = await userController.userRegister(req);
  res.json(result);
});
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
