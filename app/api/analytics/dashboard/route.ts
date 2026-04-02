import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import HealthMetric from "@/models/HealthMetric";
import WorkoutLog from "@/models/WorkoutLog";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { rangeDates } from "@/lib/dates";
import { calculateConsistency, calculateStreak } from "@/lib/habits";
import { calculateWorkoutStreak } from "@/lib/streak";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = Number(url.searchParams.get("days") || 30);

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  await connectDB();

  const [metrics, workoutLogs, habits, habitLogs] = await Promise.all([
    HealthMetric.find({
      userId: session.user.id,
      date: { $gte: start.toISOString().slice(0, 10) },
    }),
    WorkoutLog.find({
      userId: session.user.id,
      date: { $gte: start.toISOString().slice(0, 10) },
    }),
    Habit.find({ userId: session.user.id, active: true }),
    HabitLog.find({
      userId: session.user.id,
      date: { $gte: start.toISOString().slice(0, 10) },
    }),
  ]);

  const metricMap = new Map(metrics.map((m) => [m.date, m]));
  const workoutMap = new Map<string, number>();
  workoutLogs.forEach((log) => {
    workoutMap.set(log.date, (workoutMap.get(log.date) || 0) + log.duration);
  });

  const dates = rangeDates(start, end);
  const healthSeries = dates.map((date) => {
    const metric = metricMap.get(date);
    return {
      date,
      calories: metric?.calories || 0,
      weight: metric?.weight || null,
      water: metric?.water || 0,
      sleepHours: metric?.sleepHours || 0,
      steps: metric?.steps || 0,
      workoutMinutes: workoutMap.get(date) || metric?.workoutMinutes || 0,
      healthScore: metric?.healthScore || 0,
    };
  });

  const habitCompletion = habits.map((habit) => {
    const logs = habitLogs.filter((log) => log.habitId === habit.id);
    const completedDates = logs.map((log) => log.date);
    const consistency = calculateConsistency(
      habit.scheduleDays,
      completedDates,
      start,
      end,
    );

    return {
      habitId: habit.id,
      title: habit.title,
      completionRate: consistency.completionRate,
      completedCount: consistency.completedCount,
      scheduledCount: consistency.scheduledCount,
      streak: calculateStreak(completedDates),
    };
  });

  const workoutStreak = calculateWorkoutStreak(
    workoutLogs.filter((log) => log.date).map((log) => new Date(log.date)),
  );

  return NextResponse.json({
    healthSeries,
    habitCompletion,
    workoutStreak,
  });
}
