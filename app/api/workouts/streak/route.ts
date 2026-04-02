import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";
import { calculateWorkoutStreak } from "@/lib/streak";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const completedWorkouts = await WorkoutLog.find({
    userId: session.user.id,
  }).select("date");

  const streak = calculateWorkoutStreak(
    completedWorkouts.map((w) => new Date(w.date)),
  );

  return NextResponse.json({ streak });
}
