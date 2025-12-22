import mongoose, { Schema, models } from "mongoose";

const DietPlanSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    planText: { type: String, required: true },
    source: { type: String, default: "ai" }, 
  },
  { timestamps: true }
);

DietPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.DietPlan ||
  mongoose.model("DietPlan", DietPlanSchema);
