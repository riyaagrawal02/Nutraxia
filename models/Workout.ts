import { Schema, model, models } from "mongoose";

const WorkoutSchema = new Schema(
  {
    userId: String,
    title: String,
    plan: String,
    duration: Number,

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
  { timestamps: true }
);

export default models.Workout || model("Workout", WorkoutSchema);
