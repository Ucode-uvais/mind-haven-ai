import express from "express";
import { auth } from "../middleware/auth";
import {
  logActivity,
  getAllUserActivities,
  getTodaysActivities,
} from "../controllers/activityController";

const router = express.Router();

router.use(auth);

router.post("/", logActivity);
router.get("/", getAllUserActivities);
router.get("/today", getTodaysActivities);

export default router;
