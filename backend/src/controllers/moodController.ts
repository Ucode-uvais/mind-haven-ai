//to handle logic for creating mood entries

import { Request, Response, NextFunction } from "express";

import { Mood } from "../models/Mood";

import { logger } from "../utils/logger";

export const logMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { score, note, context, activities } = req.body;
    const userId = req.user._id; //from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not Authenticated" });
    }

    const mood = new Mood({
      userId,
      score,
      note,
      context,
      activities,
      timestamp: new Date(),
    });
    await mood.save();
    logger.info(`Mood logged for user ${userId}`);
    res.status(201).json({ success: true, data: mood });
  } catch (error) {
    logger.error("Error Logging Mood", error);
    next(error);
  }
};
