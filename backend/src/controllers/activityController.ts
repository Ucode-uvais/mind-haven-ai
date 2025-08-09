import { Request, Response, NextFunction } from "express";

import { Activity } from "../models/Activity";

import { logger } from "../utils/logger";

//log a new activity

export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not Authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    logger.error("Error logging activity:", error);
    next(error);
  }
};

export const getAllUserActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not Authenticated" });
    }

    const activities = await Activity.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(activities);
  } catch (error) {
    logger.error("Error fetching all user activities:", error);
    next(error);
  }
};

export const getTodaysActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not Authenticated" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      userId,
      timestamp: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    }).sort({ timestamp: -1 });

    res.status(200).json(activities);
  } catch (error) {
    logger.error("Error fetching today's activities:", error);
    next(error);
  }
};
