import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import DailyLog from "@/models/DailyLog";
import HealthMetric from "@/models/HealthMetric";
import { toDateString } from "@/lib/dates";
import { awardXp } from "@/lib/gamification";
import { estimateCaloriesBurned } from "@/lib/workout";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  await connectDB();

  const query: {
    userId: string;
    date?: { $gte?: string; $lte?: string };
  } = { userId: session.user.id };
  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  const logs = await WorkoutLog.find(query).sort({ date: -1 });

  return NextResponse.json({ logs });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const date = body.date || toDateString();

  await connectDB();

  let caloriesBurned = body.caloriesBurned || 0;
  if (!caloriesBurned && body.met && (body.weightKg || body.weight)) {
    caloriesBurned = estimateCaloriesBurned(
      Number(body.met),
      Number(body.weightKg || body.weight),
      Number(body.duration || 0),
    );
  }

  const log = await WorkoutLog.create({
    userId: session.user.id,
    workoutId: body.workoutId,
    date,
    duration: body.duration || 0,
    caloriesBurned,
    split: body.split || "custom",
    exercises: body.exercises || [],
    notes: body.notes || "",
  });

  await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $inc: {
        workoutMinutes: body.duration || 0,
        caloriesBurned,
      },
    },
    { upsert: true },
  );

  await HealthMetric.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $inc: {
        workoutMinutes: body.duration || 0,
        caloriesBurned,
      },
    },
    { upsert: true },
  );

  await awardXp(session.user.id, 20);

  return NextResponse.json({ log });
}
