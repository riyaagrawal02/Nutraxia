import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import GamificationProfile from "@/models/GamificationProfile";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const profile = await GamificationProfile.findOneAndUpdate(
    { userId: session.user.id },
    { $setOnInsert: { userId: session.user.id } },
    { upsert: true, new: true },
  );

  return NextResponse.json({ profile });
}
