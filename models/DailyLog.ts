import { Schema, model, models } from "mongoose";

const DailyLogSchema = new Schema(
  {
    userId: { type: String, required: true },

    date: { type: String, required: true }, 

    steps: { type: Number, default: 0 },
    water: { type: Number, default: 0 }, 
    meals: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export default models.DailyLog || model("DailyLog", DailyLogSchema);
