import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "meditation",
        "exercise",
        "walking",
        "reading",
        "journaling",
        "therapy",
        "game",
      ],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      min: [0, "Duration cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Duration must be a valid number",
      },
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "normal", "hard"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ userId: 1, timestamp: -1 });

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
