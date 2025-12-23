import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { steps } = await req.json();
  if (!steps || steps < 0) {
    return NextResponse.json({ error: "Invalid steps" }, { status: 400 });
  }

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date: today },
    { $set: { steps } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
