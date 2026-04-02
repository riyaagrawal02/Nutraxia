import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import HealthMetric from "@/models/HealthMetric";
import DailyLog from "@/models/DailyLog";
import UserSettings from "@/models/UserSettings";
import { toDateString } from "@/lib/dates";
import { calculateHealthScore } from "@/lib/healthScore";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import WorkoutLog from "@/models/WorkoutLog";
import { calculateConsistency } from "@/lib/habits";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date") || toDateString();

  await connectDB();

  const metric = await HealthMetric.findOne({
    userId: session.user.id,
    date,
  });

  return NextResponse.json({ metric });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const date = body.date || toDateString();

  await connectDB();

  const settings = await UserSettings.findOne({ userId: session.user.id });

  let habitCompletion = body.habitCompletion;
  let weeklyWorkouts = body.weeklyWorkouts;

  if (habitCompletion === undefined || weeklyWorkouts === undefined) {
    const end = new Date(date);
    const start = new Date(date);
    start.setDate(end.getDate() - 6);
    const startStr = start.toISOString().slice(0, 10);

    const [habits, habitLogs, workoutLogs] = await Promise.all([
      Habit.find({ userId: session.user.id, active: true }),
      HabitLog.find({
        userId: session.user.id,
        date: { $gte: startStr, $lte: date },
      }),
      WorkoutLog.find({
        userId: session.user.id,
        date: { $gte: startStr, $lte: date },
      }),
    ]);

    if (habitCompletion === undefined) {
      const totals = habits.map((habit) => {
        const logs = habitLogs.filter((log) => log.habitId === habit.id);
        const completedDates = logs.map((log) => log.date);
        return calculateConsistency(
          habit.scheduleDays,
          completedDates,
          start,
          end,
        );
      });

      const scheduled = totals.reduce((sum, t) => sum + t.scheduledCount, 0);
      const completed = totals.reduce((sum, t) => sum + t.completedCount, 0);
      habitCompletion = scheduled ? completed / scheduled : 0;
    }

    if (weeklyWorkouts === undefined) {
      const workoutDays = new Set(workoutLogs.map((log) => log.date));
      weeklyWorkouts = workoutDays.size;
    }
  }

  const healthScore = calculateHealthScore({
    sleepHours: body.sleepHours || 0,
    waterMl: body.water || 0,
    steps: body.steps || 0,
    calories: body.calories || 0,
    calorieTarget: settings?.targets?.calories || 2000,
    habitCompletion: habitCompletion || 0,
    weeklyWorkouts: weeklyWorkouts || 0,
    workoutTarget: settings?.targets?.workoutDays || 4,
  });

  const metric = await HealthMetric.findOneAndUpdate(
    { userId: session.user.id, date },
    { $set: { ...body, date, healthScore } },
    { upsert: true, new: true },
  );

  await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $set: {
        steps: body.steps ?? 0,
        water: body.water ? body.water / 1000 : 0,
        sleep: body.sleepHours ?? 0,
        calories: body.calories ?? 0,
        protein: body.protein ?? 0,
        carbs: body.carbs ?? 0,
        fats: body.fats ?? 0,
        weight: body.weight,
        workoutMinutes: body.workoutMinutes ?? 0,
        caloriesBurned: body.caloriesBurned ?? 0,
        mood: body.mood ?? 3,
        energy: body.energy ?? 3,
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ metric });
}
