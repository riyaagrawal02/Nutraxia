import { Schema, model, models } from "mongoose";

const TodoSchema = new Schema(
  {
    userId: String,
    title: String,
    time: String,
    completed: { type: Boolean, default: false },
    date: String, // YYYY-MM-DD
  },
  { timestamps: true }
);

export default models.Todo || model("Todo", TodoSchema);
