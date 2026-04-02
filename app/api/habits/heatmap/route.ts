import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import HabitLog from "@/models/HabitLog";
import { rangeDates } from "@/lib/dates";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  const endDate = end ? new Date(end) : new Date();
  const startDate = start ? new Date(start) : new Date(endDate);
  if (!start) startDate.setDate(endDate.getDate() - 364);

  await connectDB();

  const logs = await HabitLog.find({
    userId: session.user.id,
    date: {
      $gte: startDate.toISOString().slice(0, 10),
      $lte: endDate.toISOString().slice(0, 10),
    },
  });

  const map: Record<string, number> = {};
  for (const log of logs) {
    map[log.date] = (map[log.date] || 0) + 1;
  }

  const days = rangeDates(startDate, endDate).map((date) => ({
    date,
    count: map[date] || 0,
  }));

  return NextResponse.json({ days });
}
