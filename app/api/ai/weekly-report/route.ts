import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import DailyLog from "@/models/DailyLog";
import WeeklyAIReport from "@/models/WeeklyAIReport";
import { generateAISummary } from "@/lib/ai";

function getWeekRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);

  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { start, end } = getWeekRange();

 
  const cached = await WeeklyAIReport.findOne({
    userId: session.user.id,
    weekStart: start,
  });

  if (cached) {
    return NextResponse.json({ report: cached.summary });
  }

  const logs = await DailyLog.find({
    userId: session.user.id,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });

  if (logs.length === 0) {
    return NextResponse.json({
      report: "Log your daily activities to receive weekly AI insights.",
    });
  }

 
  const summaryData = logs
    .map(
      (d) =>
        `${d.date}: water ${d.water}L, meals ${d.meals}, sleep ${d.sleep}h, steps ${d.steps}`
    )
    .join("\n");

  const prompt = `
User weekly health data (last 7 days):
${summaryData}

Generate a weekly health report:
- 3 key observations
- 1 improvement suggestion
- Friendly, motivating tone
- No medical advice
- Max 5 bullet points
`;

  const aiSummary = await generateAISummary(prompt);
  await WeeklyAIReport.create({
    userId: session.user.id,
    weekStart: start,
    weekEnd: end,
    summary: aiSummary,
  });

  return NextResponse.json({ report: aiSummary });
}
