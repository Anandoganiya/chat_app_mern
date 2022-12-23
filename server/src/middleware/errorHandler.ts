import { Request, Response, NextFunction } from "express";
import { ErrorGenerator } from "../utils";

export const errorHandler = (
  error: ErrorGenerator,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error.status) {
    res.status(error.status).json({ error: error.message });
  } else if (error.message) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: error.message });
  }
  next();
};
