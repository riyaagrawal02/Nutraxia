import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DietLog from "@/models/DietLog";
import { rangeDates } from "@/lib/dates";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = Number(url.searchParams.get("days") || 7);

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  await connectDB();

  const logs = await DietLog.find({
    userId: session.user.id,
    date: { $gte: start.toISOString().slice(0, 10) },
  });

  const map = new Map(logs.map((l) => [l.date, l]));
  const series = rangeDates(start, end).map((date) => {
    const log = map.get(date);
    return {
      date,
      calories: log?.calories || 0,
      protein: log?.protein || 0,
      carbs: log?.carbs || 0,
      fats: log?.fats || 0,
      water: log?.water || 0,
    };
  });

  return NextResponse.json({ series });
}
