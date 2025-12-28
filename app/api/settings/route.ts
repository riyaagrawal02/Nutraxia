import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import UserSettings from "@/models/UserSettings";


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  let settings = await UserSettings.findOne({
    userId: session.user.id,
  });

 
  if (!settings) {
    settings = await UserSettings.create({
      userId: session.user.id,
    });
  }

  return NextResponse.json({ settings });
}


export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await connectDB();

  const settings = await UserSettings.findOneAndUpdate(
    { userId: session.user.id },
    {
      remindersEnabled: body.remindersEnabled,
      aiEnabled: body.aiEnabled,
      weeklyReport: body.weeklyReport,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ settings });
}
