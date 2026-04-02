import { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema(
  {
    userId: String,
    title: String,
    plan: String,
    split: { type: String, default: "custom" },
    duration: Number,
    caloriesBurned: { type: Number, default: 0 },
    exercises: { type: Array, default: [] },

    source: {
      type: String,
      enum: ["ai", "manual"],
      default: "manual",
    },

    scheduled: { type: Boolean, default: false },

    completed: { type: Boolean, default: false },
    completedAt: { type: Date },

    date: String, // YYYY-MM-DD (scheduled date)
  },
  { timestamps: true },
);

export default models.Workout || model("Workout", WorkoutSchema);
