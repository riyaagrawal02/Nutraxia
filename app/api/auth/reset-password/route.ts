import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    await connectDB();

    const record = await PasswordResetToken.findOne({ token });

    if (!record || record.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(record.userId, { password: hashed });
    await PasswordResetToken.deleteMany({ userId: record.userId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Reset password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
