import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { generateAISummary } from "@/lib/ai";
import { calculateProfileCompletion } from "@/lib/profileCompletion";
import UserProfile from "@/models/UserProfile";
import DailyLog from "@/models/DailyLog";
import DailyAISummary from "@/models/DailyAISummary";

async function generateSummary(profile: any, log: any) {
  const prompt = `
User Health Profile:
Age: ${profile.age}
Gender: ${profile.gender}
Goal: ${profile.goal}
Activity Level: ${profile.activity}

Today's Health Data:
Steps: ${log.steps}
Water Intake: ${log.water} liters
Meals Logged: ${log.meals}
Sleep: ${log.sleep} hours

Generate a short daily health insight:
- Friendly, motivating tone
- Maximum 2–3 sentences
- Include 1 actionable suggestion
- No medical advice
`;

  const summary = await generateAISummary(prompt);
  return summary.slice(0, 400);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const today = new Date().toISOString().slice(0, 10);

    const cached = await DailyAISummary.findOne({
      userId: session.user.id,
      date: today,
    });

    if (cached) {
      return NextResponse.json({ summary: cached.summary });
    }

    const profile = await UserProfile.findOne({
      userId: session.user.id,
    });
    const completion = calculateProfileCompletion(profile);

if (completion < 70) {
  return NextResponse.json({
    error: "Profile incomplete",
    required: 70,
    current: completion,
  });
}

    const log = await DailyLog.findOne({
      userId: session.user.id,
      date: today,
    });

    if (!profile || !log) {
      return NextResponse.json({
        summary:
          "Complete your profile and log today’s activities to receive personalized AI insights.",
      });
    }

    if (!profile.goal || !profile.activity) {
      return NextResponse.json({
        summary:
          "Add your health goal and activity level to unlock deeper AI insights.",
      });
    }

    let summary: string;

    try {
      summary = await generateSummary(profile, log);
    } catch (aiError) {
      console.error("Groq AI error:", aiError);
      summary =
        "You're building healthy habits today. Keep logging your activities for more personalized insights.";
    }

    await DailyAISummary.create({
      userId: session.user.id,
      date: today,
      summary,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Daily AI Summary API error:", error);
    return NextResponse.json(
      {
        summary:
          "Something went wrong while generating your daily insight. Please try again later.",
      },
      { status: 500 }
    );
  }
}
