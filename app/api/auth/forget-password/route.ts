import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";


export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.deleteMany({ userId: user._id });

    await PasswordResetToken.create({
      userId: user._id.toString(),
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30), 
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;

    console.log("RESET LINK (email this):", resetLink);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Forgot password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
