import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import UserProfile from "@/models/UserProfile";
import connectDB from "@/lib/mongodb";
import { calculateProfileCompletion } from "@/lib/profileCompletion";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ completion: 0 });
  }

  await connectDB();

  const profile = await UserProfile.findOne({
    userId: session.user.id,
  });

  const completion = calculateProfileCompletion(profile);

  return NextResponse.json({ completion });
}
