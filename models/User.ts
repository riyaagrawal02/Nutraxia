import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    emailVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpires: Date,
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
