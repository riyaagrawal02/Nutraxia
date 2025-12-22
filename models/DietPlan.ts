import { Schema, model, models } from "mongoose";

const DietPlanSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true }, 
    calories: Number,
    planText: String, 
  },
  { timestamps: true }
);

DietPlanSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.DietPlan || model("DietPlan", DietPlanSchema);
