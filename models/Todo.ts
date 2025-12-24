import { Schema, model, models } from "mongoose";

const TodoSchema = new Schema(
  {
    userId: { type: String, required: true },

    title: { type: String, required: true },

    time: { type: String },

    completed: { type: Boolean, default: false },

    date: { type: String }, // YYYY-MM-DD
  },
  { timestamps: true }
);

export default models.Todo || model("Todo", TodoSchema);
