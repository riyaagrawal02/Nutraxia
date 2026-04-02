import { Schema, model, models } from "mongoose";

const DietLogSchema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    meals: { type: Array, default: [] },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
  },
  { timestamps: true },
);

DietLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default models.DietLog || model("DietLog", DietLogSchema);
