import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/ToDos";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const todo = await Todo.findById(params.id);
  todo.completed = !todo.completed;
  await todo.save();

  return NextResponse.json({ todo });
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Todo.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
