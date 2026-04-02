import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import HealthMetric from "@/models/HealthMetric";
import WorkoutLog from "@/models/WorkoutLog";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { getMonthlyRange } from "@/lib/reports";
import { calculateConsistency } from "@/lib/habits";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { start, end } = getMonthlyRange();
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);

  await connectDB();

  const [metrics, workoutLogs, habits, habitLogs] = await Promise.all([
    HealthMetric.find({
      userId: session.user.id,
      date: { $gte: startStr, $lte: endStr },
    }),
    WorkoutLog.find({
      userId: session.user.id,
      date: { $gte: startStr, $lte: endStr },
    }),
    Habit.find({ userId: session.user.id, active: true }),
    HabitLog.find({
      userId: session.user.id,
      date: { $gte: startStr, $lte: endStr },
    }),
  ]);

  const sortedMetrics = metrics.sort((a, b) => a.date.localeCompare(b.date));
  const caloriesTotal = sortedMetrics.reduce(
    (sum, m) => sum + (m.calories || 0),
    0,
  );
  const workoutMinutes = workoutLogs.reduce(
    (sum, log) => sum + (log.duration || 0),
    0,
  );

  const weightStart = sortedMetrics[0]?.weight ?? null;
  const weightEnd = sortedMetrics[sortedMetrics.length - 1]?.weight ?? null;
  const weightChange =
    weightStart !== null && weightEnd !== null
      ? Number((weightEnd - weightStart).toFixed(1))
      : null;

  const healthScoreAvg = sortedMetrics.length
    ? Math.round(
        sortedMetrics.reduce((sum, m) => sum + (m.healthScore || 0), 0) /
          sortedMetrics.length,
      )
    : 0;

  const habitCompletion = habits.map((habit) => {
    const logs = habitLogs.filter((log) => log.habitId === habit.id);
    const completedDates = logs.map((log) => log.date);
    return calculateConsistency(habit.scheduleDays, completedDates, start, end);
  });

  const totalScheduled = habitCompletion.reduce(
    (sum, h) => sum + h.scheduledCount,
    0,
  );
  const totalCompleted = habitCompletion.reduce(
    (sum, h) => sum + h.completedCount,
    0,
  );
  const habitCompletionPct = totalScheduled
    ? Math.round((totalCompleted / totalScheduled) * 100)
    : 0;

  const summary = {
    periodStart: startStr,
    periodEnd: endStr,
    habitCompletionPct,
    workoutHours: Number((workoutMinutes / 60).toFixed(1)),
    caloriesTotal,
    weightChange,
    healthScoreAvg,
    consistencyScore: habitCompletionPct,
  };

  const report = await Report.findOneAndUpdate(
    {
      userId: session.user.id,
      type: "monthly",
      periodStart: startStr,
      periodEnd: endStr,
    },
    { $set: { summary } },
    { upsert: true, new: true },
  );

  return NextResponse.json({ report });
}
