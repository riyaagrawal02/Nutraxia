import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import connectDB from "@/lib/mongodb";
import { generateAISummary } from "@/lib/ai";

import UserProfile from "@/models/UserProfile";
import DietPlan from "@/models/DietPlan";

async function generateDietPlan(profile: any) {
  const prompt = `
User Profile:
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Activity Level: ${profile.activity}
Goal: ${profile.goal}

Create a simple daily diet plan:
- Indian friendly foods
- Mention daily calorie target
- Breakfast, Lunch, Snack, Dinner
- Keep it practical and affordable
- No medical advice
- Short and structured
`;

  return await generateAISummary(prompt);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const existing = await DietPlan.findOne({
    userId: session.user.id,
    date: today,
  });

  if (existing) {
    return NextResponse.json({ plan: existing });
  }

  return NextResponse.json({ plan: null });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customPrompt } = await req.json();

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const profile = await UserProfile.findOne({
    userId: session.user.id,
  });

  if (!profile) {
    return NextResponse.json({
      error: "Complete your profile first.",
    });
  }

  const prompt = `
User Profile:
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Activity Level: ${profile.activity}
Goal: ${profile.goal}

User request:
${customPrompt || "Generate a balanced diet based on my profile."}

Instructions:
- Indian-friendly foods
- Simple & affordable
- Daily calorie mention
- Breakfast, Lunch, Snack, Dinner
- No medical advice
- Clear structure
`;

  let planText = "";

  try {
    planText = await generateAISummary(prompt);
  } catch (err: any) {
    console.error("Diet AI error:", err.message);
    return NextResponse.json({
      error: err.message || "AI generation failed",
    });
  }

  const plan = await DietPlan.findOneAndUpdate(
    { userId: session.user.id, date: today },
    {
      userId: session.user.id,
      date: today,
      planText,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ plan });
}
