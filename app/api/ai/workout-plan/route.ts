import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt || prompt.length < 10) {
      return NextResponse.json(
        { error: "Prompt too short" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a professional fitness assistant.
Rules:
- No medical advice
- Beginner-friendly language
- Clear bullet points
- Include warm-up, workout, cool-down
- Keep it practical and safe
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    const plan =
      completion.choices[0]?.message?.content ||
      "Unable to generate workout plan.";

    return NextResponse.json({ plan });
  } catch (err: any) {
    console.error("Groq Workout Error:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
