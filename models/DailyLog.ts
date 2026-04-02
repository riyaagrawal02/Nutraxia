import { Schema, model, models } from "mongoose";

const DailyLogSchema = new Schema(
  {
    userId: { type: String, required: true },

    date: { type: String, required: true },

    steps: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    meals: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 },

    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    weight: { type: Number },
    workoutMinutes: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    mood: { type: Number, default: 3 },
    energy: { type: Number, default: 3 },
  },
  { timestamps: true },
);

export default models.DailyLog || model("DailyLog", DailyLogSchema);
