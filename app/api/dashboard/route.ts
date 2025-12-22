import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import Todo from "@/models/ToDos";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const today = new Date().toISOString().slice(0, 10);

  const log =
    (await DailyLog.findOne({
      userId: session.user.id,
      date: today,
    })) ||
    (await DailyLog.create({
      userId: session.user.id,
      date: today,
    }));

  const todos = await Todo.find({
    userId: session.user.id,
    date: today,
  });

  return NextResponse.json({
    stats: {
      steps: log.steps,
      water: log.water,
      meals: log.meals,
      sleep: log.sleep,
    },
    todos,
  });
}
