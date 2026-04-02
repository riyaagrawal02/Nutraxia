import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Workout from "@/models/Workout";
import WorkoutLog from "@/models/WorkoutLog";
import DailyLog from "@/models/DailyLog";
import HealthMetric from "@/models/HealthMetric";
import { toDateString } from "@/lib/dates";
import { awardXp } from "@/lib/gamification";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const workout = await Workout.findById(id);

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    if (workout.completed) {
      return NextResponse.json({ success: true });
    }

    workout.completed = true;
    workout.completedAt = new Date();
    await workout.save();

    const date = toDateString(workout.completedAt);

    await WorkoutLog.create({
      userId: workout.userId,
      workoutId: workout.id,
      date,
      duration: workout.duration || 0,
      caloriesBurned: workout.caloriesBurned || 0,
      split: workout.split || "custom",
      exercises: workout.exercises || [],
    });

    await DailyLog.findOneAndUpdate(
      { userId: workout.userId, date },
      {
        $inc: {
          workoutMinutes: workout.duration || 0,
          caloriesBurned: workout.caloriesBurned || 0,
        },
      },
      { upsert: true },
    );

    await HealthMetric.findOneAndUpdate(
      { userId: workout.userId, date },
      {
        $inc: {
          workoutMinutes: workout.duration || 0,
          caloriesBurned: workout.caloriesBurned || 0,
        },
      },
      { upsert: true },
    );

    await awardXp(workout.userId, 20);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    await Workout.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
