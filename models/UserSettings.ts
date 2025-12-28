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
  },
  { timestamps: true }
);

export default models.UserSettings ||
  model("UserSettings", UserSettingsSchema);
