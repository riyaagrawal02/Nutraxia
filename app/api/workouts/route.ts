import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Workout from "@/models/Workout";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const workouts = await Workout.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ workouts });
  } catch (err) {
    console.error("WORKOUT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, plan, duration, source, scheduled } = await req.json();

  await connectDB();

  await Workout.create({
    userId: session.user.id,
    title,
    plan,
    duration,
    source,
    scheduled,
    date: new Date().toISOString().slice(0, 10),
  });

  return NextResponse.json({ success: true });
}
