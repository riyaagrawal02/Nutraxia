import { Schema, model, models } from "mongoose";

const GamificationProfileSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    totalXp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    streakRewards: { type: [String], default: [] },
    milestones: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default models.GamificationProfile ||
  model("GamificationProfile", GamificationProfileSchema);
