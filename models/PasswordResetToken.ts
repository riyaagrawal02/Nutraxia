import { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default models.PasswordResetToken ||
  model("PasswordResetToken", PasswordResetTokenSchema);
