import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DietLog from "@/models/DietLog";
import DailyLog from "@/models/DailyLog";
import HealthMetric from "@/models/HealthMetric";
import { toDateString } from "@/lib/dates";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const date = url.searchParams.get("date") || toDateString();

  await connectDB();

  const log = await DietLog.findOne({ userId: session.user.id, date });

  return NextResponse.json({ log });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const date = body.date || toDateString();

  await connectDB();

  const log = await DietLog.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $set: {
        meals: body.meals || [],
        calories: body.calories || 0,
        protein: body.protein || 0,
        carbs: body.carbs || 0,
        fats: body.fats || 0,
        water: body.water || 0,
      },
    },
    { upsert: true, new: true },
  );

  await DailyLog.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $set: {
        calories: body.calories || 0,
        protein: body.protein || 0,
        carbs: body.carbs || 0,
        fats: body.fats || 0,
        water: body.water ? body.water / 1000 : 0,
      },
    },
    { upsert: true },
  );

  await HealthMetric.findOneAndUpdate(
    { userId: session.user.id, date },
    {
      $set: {
        calories: body.calories || 0,
        protein: body.protein || 0,
        carbs: body.carbs || 0,
        fats: body.fats || 0,
        water: body.water || 0,
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ log });
}
