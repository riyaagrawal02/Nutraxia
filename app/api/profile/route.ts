import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const profile = await UserProfile.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.log("PROFILE GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await connectDB();

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        age: body.age,
        gender: body.gender,
        height: body.height,
        weight: body.weight,
        activity: body.activity,
        goal: body.goal,
        avatarUrl: body.avatarUrl,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.log("PROFILE SAVE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
