"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu } from "lucide-react";

const MANUAL_WORKOUTS = [
  {
    title: "Beginner Full Body",
    desc: "Simple full-body workout, no equipment",
    exercises: [
      "Jumping Jacks – 2 min",
      "Push-ups – 3 × 10",
      "Bodyweight Squats – 3 × 15",
      "Plank – 3 × 30 sec",
      "Stretching – 5 min",
    ],
  },
  {
    title: "Weight Loss Cardio",
    desc: "Burn calories & boost stamina",
    exercises: [
      "High Knees – 2 min",
      "Mountain Climbers – 3 × 30 sec",
      "Burpees – 3 × 10",
      "Brisk Walk – 10 min",
    ],
  },
  {
    title: "Muscle Building (Home)",
    desc: "Strength-focused routine",
    exercises: [
      "Push-ups – 4 × 12",
      "Squats – 4 × 15",
      "Chair Dips – 3 × 10",
      "Plank – 3 × 40 sec",
    ],
  },
];

export default function WorkoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiWorkout, setAiWorkout] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWorkout = async () => {
    if (!customPrompt) return;
    setLoading(true);

    const res = await fetch("/api/ai/workout-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: customPrompt }),
    });

    const json = await res.json();
    setAiWorkout(json.plan);
    setLoading(false);
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <header className="border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
            >
              <Menu size={18} />
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">

          {/* MANUAL PLANS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Starter Workout Plans
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {MANUAL_WORKOUTS.map((plan) => (
                <div
                  key={plan.title}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border"
                >
                  <h3 className="font-medium">{plan.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{plan.desc}</p>

                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {plan.exercises.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* AI GENERATOR */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Generate AI Workout Plan
            </h2>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Example: 30 min home workout for fat loss, beginner"
              className="w-full p-4 rounded-xl border bg-white dark:bg-slate-900"
            />

            <button
              onClick={generateWorkout}
              className="mt-3 px-6 py-2 rounded-xl bg-emerald-600 text-white"
            >
              Generate Workout
            </button>
          </section>

          {/* RESULT */}
          {loading && (
            <div className="h-40 bg-white dark:bg-slate-900 rounded-xl animate-pulse" />
          )}

          {aiWorkout && (
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border">
              <h3 className="text-sm uppercase font-semibold text-emerald-600 mb-3">
                Your AI Workout Plan
              </h3>
              <pre className="whitespace-pre-wrap text-sm">
                {aiWorkout}
              </pre>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
