import { Schema, model, models } from "mongoose";

const UserProfileSchema = new Schema(
  {
    userId: { type: String, required: true }, 
    age: String,
    gender: String,
    height: String,
    weight: String,
    activity: String,
    goal: String,
    avatarUrl: String,
  },
  { timestamps: true }
);

export default models.UserProfile || model("UserProfile", UserProfileSchema);
