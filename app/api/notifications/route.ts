import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const notifications = await Notification.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ notifications });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  await connectDB();

  const notification = await Notification.create({
    userId: session.user.id,
    type: body.type || "custom",
    title: body.title || "",
    message: body.message || "",
    scheduleAt: body.scheduleAt ? new Date(body.scheduleAt) : undefined,
    status: body.scheduleAt ? "pending" : "sent",
    sentAt: body.scheduleAt ? undefined : new Date(),
  });

  return NextResponse.json({ notification });
}
