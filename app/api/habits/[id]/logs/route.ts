import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { isRecoveryAllowed, todayString } from "@/lib/habits";
import { awardXp, xpForDifficulty } from "@/lib/gamification";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  await connectDB();

  const query: {
    userId: string;
    habitId: string;
    date?: { $gte?: string; $lte?: string };
  } = {
    userId: session.user.id,
    habitId: id,
  };

  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  const logs = await HabitLog.find(query).sort({ date: -1 });

  return NextResponse.json({ logs });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { date, note } = await req.json();
  const targetDate = date || todayString();

  await connectDB();

  const habit = await Habit.findOne({ _id: id, userId: session.user.id });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const recovered =
    targetDate !== todayString()
      ? isRecoveryAllowed(targetDate, habit.recoveryWindowHours)
      : false;

  if (targetDate !== todayString() && !recovered) {
    return NextResponse.json(
      { error: "Recovery window expired" },
      { status: 400 },
    );
  }

  const log = await HabitLog.findOneAndUpdate(
    { userId: session.user.id, habitId: id, date: targetDate },
    { $set: { completed: true, recovered, note } },
    { upsert: true, new: true },
  );

  await awardXp(session.user.id, xpForDifficulty(habit.difficulty));

  return NextResponse.json({ log });
}
