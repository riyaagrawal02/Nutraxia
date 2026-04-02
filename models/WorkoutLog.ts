import { Schema, model, models } from "mongoose";

const WorkoutLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    workoutId: { type: String },
    date: { type: String, required: true },
    duration: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    split: { type: String, default: "custom" },
    exercises: { type: Array, default: [] },
    notes: { type: String },
  },
  { timestamps: true },
);

WorkoutLogSchema.index({ userId: 1, date: 1 });

export default models.WorkoutLog || model("WorkoutLog", WorkoutLogSchema);
