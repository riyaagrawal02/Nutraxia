import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { days, startDate } = await req.json();
  // days = ["Full Body", "Cardio", "Rest", "Upper Body", "Core"]

  if (!Array.isArray(days) || days.length === 0) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await connectDB();

  const baseDate = new Date(startDate || new Date());

  const todos = days.map((workout, index) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + index);

    return {
      userId: session.user.id,
      title: workout === "Rest"
        ? "Rest & Recovery"
        : `${workout} Workout`,
      time: "07:00",
      completed: false,
      date: d.toISOString().slice(0, 10),
      type: "workout",
    };
  });

  await Todo.insertMany(todos);

  return NextResponse.json({ success: true });
}
