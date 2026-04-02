import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ["habit", "workout", "water", "sleep", "report", "custom"],
      default: "custom",
    },
    title: { type: String },
    message: { type: String },
    scheduleAt: { type: Date },
    status: { type: String, enum: ["pending", "sent"], default: "pending" },
    sentAt: { type: Date },
  },
  { timestamps: true },
);

NotificationSchema.index({ userId: 1, status: 1, scheduleAt: 1 });

export default models.Notification || model("Notification", NotificationSchema);
