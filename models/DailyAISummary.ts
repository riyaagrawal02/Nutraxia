import { Schema, model, models } from "mongoose";

const DailyAISummarySchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

DailyAISummarySchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.DailyAISummary ||
  model("DailyAISummary", DailyAISummarySchema);
