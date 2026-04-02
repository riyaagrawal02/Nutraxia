import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import HealthMetric from "@/models/HealthMetric";
import { rangeDates } from "@/lib/dates";

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

  const metrics = await HealthMetric.find({
    userId: session.user.id,
    date: { $gte: start.toISOString().slice(0, 10) },
  });

  const map = new Map(metrics.map((m) => [m.date, m]));

  const series = rangeDates(start, end).map((date) => {
    const metric = map.get(date);
    return {
      date,
      weight: metric?.weight || null,
      calories: metric?.calories || 0,
      water: metric?.water || 0,
      sleepHours: metric?.sleepHours || 0,
      steps: metric?.steps || 0,
      workoutMinutes: metric?.workoutMinutes || 0,
      healthScore: metric?.healthScore || 0,
    };
  });

  return NextResponse.json({ series });
}
