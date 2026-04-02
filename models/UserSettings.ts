import { Schema, models, model } from "mongoose";

const UserSettingsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },

    remindersEnabled: {
      type: Boolean,
      default: true,
    },

    aiEnabled: {
      type: Boolean,
      default: true,
    },

    weeklyReport: {
      type: Boolean,
      default: false,
    },

    targets: {
      sleepHours: { type: Number, default: 8 },
      waterMl: { type: Number, default: 2500 },
      calories: { type: Number, default: 2000 },
      steps: { type: Number, default: 10000 },
      workoutDays: { type: Number, default: 4 },
      protein: { type: Number, default: 120 },
      carbs: { type: Number, default: 250 },
      fats: { type: Number, default: 60 },
    },

    reminderPrefs: {
      habits: { type: Boolean, default: true },
      workouts: { type: Boolean, default: true },
      water: { type: Boolean, default: true },
      sleep: { type: Boolean, default: true },
      reports: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export default models.UserSettings || model("UserSettings", UserSettingsSchema);
