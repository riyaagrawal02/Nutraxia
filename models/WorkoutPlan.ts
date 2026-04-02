import { Schema, model, models } from "mongoose";

const WorkoutPlanSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    splitType: {
      type: String,
      enum: ["push", "pull", "legs", "full", "custom"],
      default: "custom",
    },
    scheduleDays: { type: [Number], default: [1, 3, 5] },
    restDays: { type: [Number], default: [0, 2, 4, 6] },
    exercises: { type: Array, default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

WorkoutPlanSchema.index({ userId: 1, active: 1 });

export default models.WorkoutPlan || model("WorkoutPlan", WorkoutPlanSchema);
