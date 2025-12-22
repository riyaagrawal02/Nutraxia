import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/ToDos";

/* GET → today's todos */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const todos = await Todo.find({
    userId: session.user.id,
    date: today,
  }).sort({ time: 1 });

  return NextResponse.json({ todos });
}

/* POST → add todo */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, time } = await req.json();
  if (!title)
    return NextResponse.json({ error: "Title required" }, { status: 400 });

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const todo = await Todo.create({
    userId: session.user.id,
    title,
    time,
    date: today,
  });

  return NextResponse.json({ todo });
}
