import { Schema, model, models } from "mongoose";

const DietPlanSchema = new Schema(
  {
    userId: { type: String, required: true },
    planId: String,
    calories: Number,
    maintenanceCalories: Number,
    goal: String,
    content: String,
  },
  { timestamps: true }
);

export default models.DietPlan || model("DietPlan", DietPlanSchema);
