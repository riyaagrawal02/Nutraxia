import { Schema, model, models } from "mongoose";

const HabitSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    scheduleDays: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    active: { type: Boolean, default: true },
    recoveryWindowHours: { type: Number, default: 48 },
  },
  { timestamps: true },
);

HabitSchema.index({ userId: 1, active: 1 });

export default models.Habit || model("Habit", HabitSchema);
