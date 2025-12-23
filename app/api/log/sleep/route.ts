import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";

function calcSleepHours(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) endMin += 24 * 60; // crossed midnight

  return Number(((endMin - startMin) / 60).toFixed(1));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sleepFrom, wakeAt } = await req.json();
  const sleep = calcSleepHours(sleepFrom, wakeAt);

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date: today },
    { $set: { sleep } },
    { upsert: true }
  );

  return NextResponse.json({ success: true, sleep });
}
