import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { calculateConsistency, calculateStreak } from "@/lib/habits";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const habits = await Habit.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);

  const logs = await HabitLog.find({
    userId: session.user.id,
    date: { $gte: start.toISOString().slice(0, 10) },
  });

  const data = habits.map((habit) => {
    const habitLogs = logs.filter((log) => log.habitId === habit.id);
    const completedDates = habitLogs.map((log) => log.date);

    const consistency = calculateConsistency(
      habit.scheduleDays,
      completedDates,
      start,
      end,
    );

    return {
      habit,
      stats: {
        streak: calculateStreak(completedDates),
        completionRate: consistency.completionRate,
        completedCount: consistency.completedCount,
        scheduledCount: consistency.scheduledCount,
      },
    };
  });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, scheduleDays, difficulty, recoveryWindowHours } =
    await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  await connectDB();

  const habit = await Habit.create({
    userId: session.user.id,
    title,
    scheduleDays: scheduleDays || [0, 1, 2, 3, 4, 5, 6],
    difficulty: difficulty || "easy",
    recoveryWindowHours: recoveryWindowHours || 48,
  });

  return NextResponse.json({ habit });
}
