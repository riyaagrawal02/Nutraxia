import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DietPlan from "@/models/DietPlan";
import UserProfile from "@/models/UserProfile";
import { generateAISummary } from "@/lib/ai";

const FALLBACK_DIET = `
Daily Calories: ~1800 kcal

Breakfast:
- Vegetable omelette / poha
- 1 fruit

Lunch:
- Dal
- 2 rotis
- Salad

Snack:
- Fruit or handful of nuts

Dinner:
- Light sabzi
- 1–2 rotis

Notes:
- Drink 2.5L water
- Avoid late-night sugar
`;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const today = new Date().toISOString().slice(0, 10);

  const profile = await UserProfile.findOne({
    userId: session.user.id,
  });

  if (!profile) {
    return NextResponse.json({
      error: "Complete profile to generate diet plan",
    });
  }

  let planText = "";
  let source = "ai";

  const prompt = `
User Profile:
Age: ${profile.age}
Height: ${profile.height}
Weight: ${profile.weight}
Goal: ${profile.goal}
Activity: ${profile.activity}

Generate a simple Indian diet plan.
- Mention calories
- Breakfast, Lunch, Snack, Dinner
- Practical & affordable
- No medical advice
`;

  try {
    planText = await generateAISummary(prompt);
  } catch (err) {
    console.error("AI failed, using fallback");
    planText = FALLBACK_DIET;
    source = "fallback";
  }

  const plan = await DietPlan.findOneAndUpdate(
    { userId: session.user.id, date: today },
    {
      userId: session.user.id,
      date: today,
      planText,
      source,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ plan });
}
