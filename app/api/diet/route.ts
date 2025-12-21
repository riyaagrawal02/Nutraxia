import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserProfile from "@/models/UserProfile";
import DietPlan from "@/models/DietPlan";

export async function POST() {
  try {
    await connectDB();

    const profile = await UserProfile.findOne({ userId: "demo-user" });
    if (!profile) {
      return NextResponse.json(
        { error: "Profile incomplete" },
        { status: 400 }
      );
    }

    const { age, gender, height, weight, activity, goal } = profile;

    const h = Number(height);
    const w = Number(weight);
    const a = Number(age);

    const BMR =
      gender === "Male"
        ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
        : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;

    const activityFactor =
      activity === "Sedentary (little or no exercise)"
        ? 1.2
        : activity === "Light exercise (1–3 days/week)"
        ? 1.375
        : activity === "Moderate exercise (4–5 days/week)"
        ? 1.55
        : 1.725;

    const maintenanceCalories = Math.round(BMR * activityFactor);

    let targetCalories = maintenanceCalories;
    if (goal === "Weight Loss") targetCalories -= 400;
    if (goal === "Weight Gain") targetCalories += 300;
    if (goal === "Build Muscle") targetCalories += 200;

    const prompt = `
You are a certified nutritionist. Create a detailed 7-day Indian diet plan.

User:
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Activity: ${activity}
Goal: ${goal}

Daily Calories: ~${targetCalories} kcal

Rules:
- Indian meals only
- Breakfast, Lunch, Snacks, Dinner
- Calories per meal
- Safe & practical
- End with weekly shopping list
`;

    const aiResponse = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      }
    );

    const aiData = await aiResponse.json();
    const dietText = aiData.choices[0].message.content;

    const savedPlan = await DietPlan.findOneAndUpdate(
      { userId: "demo-user" },
      {
        userId: "demo-user",
        calories: targetCalories,
        maintenanceCalories,
        goal,
        content: dietText,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, plan: savedPlan });
  } catch (err) {
    console.error("Diet AI Error:", err);
    return NextResponse.json(
      { error: "AI failed to generate diet plan" },
      { status: 500 }
    );
  }
}
