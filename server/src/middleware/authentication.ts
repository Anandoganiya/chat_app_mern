import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ErrorGenerator, jwtGenerator } from "../utils";

declare global {
  namespace Express {
    interface Request {
      userId?: string | JwtPayload;
    }
  }
}

class Authentication {
  async authenticateUser(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next(
        new ErrorGenerator(400, "No authorization token sent in the request")
      );
    }

    if (!req.headers.authorization.startsWith("Bearer")) {
      return next(
        new ErrorGenerator(
          400,
          "Authorization token should be of type Bearer token"
        )
      );
    }
    const token: string = req.headers.authorization.split(" ")[1];
    try {
      const userId = await jwtGenerator.verifyToken(token);

      req.userId = userId;
      next();
    } catch (error) {
      throw new ErrorGenerator(400, "Authorization token is invalid");
    }
  }
}

export const authUser = new Authentication();
