import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DietPlan from "@/models/DietPlan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const plan = await DietPlan.findOne({
    userId: session.user.id,
    date: today,
  });

  return NextResponse.json({ plan });
}
