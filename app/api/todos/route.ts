
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const today = new Date().toISOString().slice(0, 10);

  const todos = await Todo.find({
    userId: session.user.id,
    date: today,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ todos });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const todo = await Todo.create({
    userId: session.user.id,
    title: body.title,
    time: body.time || "",
    date: new Date().toISOString().slice(0, 10),
  });

  return NextResponse.json({ todo });
}
