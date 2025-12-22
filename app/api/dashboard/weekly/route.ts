import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    last7Days.push(dateStr);
  }

  const logs = await DailyLog.find({
    userId: session.user.id,
    date: { $in: last7Days },
  });

  const data = last7Days.map((date) => {
    const log = logs.find((l) => l.date === date);
    return {
      date: date.slice(5), // MM-DD
      steps: log?.steps || 0,
      water: log?.water || 0,
      meals: log?.meals || 0,
      sleep: log?.sleep || 0,
    };
  });

  return NextResponse.json({ data });
}
