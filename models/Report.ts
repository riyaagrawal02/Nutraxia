import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ["weekly", "monthly"], required: true },
    periodStart: { type: String, required: true },
    periodEnd: { type: String, required: true },
    summary: { type: Object, default: {} },
    charts: { type: Object, default: {} },
  },
  { timestamps: true },
);

ReportSchema.index({ userId: 1, type: 1, periodStart: 1, periodEnd: 1 });

export default models.Report || model("Report", ReportSchema);
