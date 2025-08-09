import {
  Request,
  Response,
  NextFunction,
} from "express"; /*next() is a fn we call to pass the control to the next middleware or route handler*/
import { User } from "../models/User";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include a user property

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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Authentication Token", error });
  }
};
