import { Schema, model, models } from "mongoose";

const HabitLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    habitId: { type: String, required: true },
    date: { type: String, required: true },
    completed: { type: Boolean, default: true },
    recovered: { type: Boolean, default: false },
    note: { type: String },
  },
  { timestamps: true },
);

HabitLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

export default models.HabitLog || model("HabitLog", HabitLogSchema);
