import mongoose, { Schema, models } from "mongoose";

const WeeklyAIReportSchema = new Schema(
  {
    userId: { type: String, required: true },
    weekStart: { type: String, required: true }, // YYYY-MM-DD
    weekEnd: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

WeeklyAIReportSchema.index(
  { userId: 1, weekStart: 1 },
  { unique: true }
);

export default models.WeeklyAIReport ||
  mongoose.model("WeeklyAIReport", WeeklyAIReportSchema);
