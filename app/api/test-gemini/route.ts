import { NextResponse } from "next/server";
import { generateAISummary } from "@/lib/ai";

export async function GET() {
  try {
    const text = await generateAISummary("Say hello in one sentence");
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("SDK GEMINI ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
