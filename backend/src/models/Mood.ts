import mongoose, { Document, Schema } from "mongoose";

export interface IMood extends Document {
  userId: mongoose.Types.ObjectId;
  score: number;
  note?: string;
  context?: string;
  activities?: string[];
  timestamp: Date;
}

const moodSchema = new Schema<IMood>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    note: {
      type: String,
      trim: true,
    },
    context: {
      type: String,
      trim: true,
    },
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

moodSchema.index({ userId: 1, timestamp: -1 });

const Mood = mongoose.model<IMood>("Mood", moodSchema);

export { Mood };
