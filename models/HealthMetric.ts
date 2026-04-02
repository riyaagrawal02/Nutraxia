import { Schema, model, models } from "mongoose";

const HealthMetricSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },

    weight: { type: Number },
    calories: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    workoutMinutes: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    mood: { type: Number, default: 3 },
    energy: { type: Number, default: 3 },

    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },

    healthScore: { type: Number, default: 0 },
  },
  { timestamps: true },
);

HealthMetricSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.HealthMetric || model("HealthMetric", HealthMetricSchema);
