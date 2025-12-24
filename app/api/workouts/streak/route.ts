import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Workout from "@/models/Workout";
import { calculateWorkoutStreak } from "@/lib/streak";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const completedWorkouts = await Workout.find({
    userId: session.user.id,
    completed: true,
  }).select("completedAt");

  const streak = calculateWorkoutStreak(
    completedWorkouts.map(w => w.completedAt)
  );

  return NextResponse.json({ streak });
}
