import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import HealthMetric from "@/models/HealthMetric";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const log = await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date: today },
    { $inc: { water: 0.25 } }, // +250ml
    { upsert: true, new: true },
  );

  await HealthMetric.findOneAndUpdate(
    { userId: session.user.id, date: today },
    { $inc: { water: 250 } },
    { upsert: true },
  );

  return NextResponse.json({ water: log.water });
}
