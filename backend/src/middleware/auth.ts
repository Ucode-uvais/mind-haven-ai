import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid Authentication Token" });
  }
};
