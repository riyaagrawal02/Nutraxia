import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import WorkoutPlan from "@/models/WorkoutPlan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const plans = await WorkoutPlan.find({ userId: session.user.id }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ plans });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  await connectDB();

  const plan = await WorkoutPlan.create({
    userId: session.user.id,
    title: body.title,
    splitType: body.splitType || "custom",
    scheduleDays: body.scheduleDays || [1, 3, 5],
    restDays: body.restDays || [0, 2, 4, 6],
    exercises: body.exercises || [],
    active: body.active ?? true,
  });

  return NextResponse.json({ plan });
}
