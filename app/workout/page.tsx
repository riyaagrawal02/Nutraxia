"use client";

import { useEffect, useState } from "react";
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

type Workout = {
  _id: string;
  title: string;
  plan: string;
  duration: number;
  source: "ai" | "manual";
  scheduled: boolean;
  completed: boolean;
  date: string;
};

export default function WorkoutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiWorkout, setAiWorkout] = useState("");
  const [loading, setLoading] = useState(false);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchWorkouts = async () => {
    setHistoryLoading(true);
    const res = await fetch("/api/workouts");
    const json = await res.json();
    setWorkouts(json.workouts || []);
    setHistoryLoading(false);
  };

  const fetchStreak = async () => {
    const res = await fetch("/api/workouts/streak");
    const json = await res.json();
    setStreak(json.streak);
  };

  const generateWorkout = async () => {
    if (!customPrompt) return;

    setLoading(true);
    setAiWorkout("");

    const res = await fetch("/api/ai/workout-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: customPrompt }),
    });

    const json = await res.json();
    setAiWorkout(json.plan || "Failed to generate workout.");
    setLoading(false);
  };

  const saveWorkout = async (title: string, plan: string, source: "ai" | "manual") => {
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        plan,
        duration: 30,
        source,
        scheduled: true,
      }),
    });

    if (!res.ok) {
      alert("Failed to save workout");
      return;
    }

    fetchWorkouts();
    alert("Workout saved to history 💪");
  };

  useEffect(() => {
    fetchWorkouts();
    fetchStreak();
  }, []);

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
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <p className="text-xs uppercase opacity-80">Workout Streak</p>
              <h3 className="text-3xl font-bold mt-1">🔥 {streak} days</h3>
              <p className="text-xs mt-1 opacity-90">
                Keep going! Consistency beats intensity.
              </p>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">


          <section>
            <h2 className="text-xl font-semibold mb-4">Starter Workout Plans</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {MANUAL_WORKOUTS.map((plan) => (
                <div key={plan.title} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-3">
                  <h3 className="font-medium">{plan.title}</h3>
                  <p className="text-sm text-gray-500">{plan.desc}</p>

                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {plan.exercises.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      saveWorkout(plan.title, plan.exercises.join("\n"), "manual")
                    }
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Save This Plan
                  </button>
                </div>
              ))}
            </div>
          </section>


          <section>
            <h2 className="text-xl font-semibold mb-3">Generate AI Workout Plan</h2>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Example: 30 min home workout for fat loss, beginner"
              className="w-full p-4 rounded-xl border bg-white dark:bg-slate-900"
            />

            <button
              onClick={generateWorkout}
              disabled={loading}
              className="mt-3 px-6 py-2 rounded-xl bg-emerald-600 text-white"
            >
              {loading ? "Generating..." : "Generate Workout"}
            </button>
          </section>


          {aiWorkout && (
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border">
              <p className="text-xs uppercase font-semibold text-emerald-600 mb-3">
                Your AI Workout Plan
              </p>

              <pre className="whitespace-pre-wrap text-sm">{aiWorkout}</pre>

              <button
                onClick={() => saveWorkout("AI Workout Plan", aiWorkout, "ai")}
                className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 text-white"
              >
                Schedule / Save Plan
              </button>
            </section>
          )}


          <section>
            <h3 className="text-sm font-semibold mb-3">Workout History</h3>

            {historyLoading && (
              <div className="h-20 bg-white dark:bg-slate-900 rounded-xl animate-pulse" />
            )}

            {!historyLoading && workouts.length === 0 && (
              <p className="text-sm text-gray-500">
                No workouts saved yet.
              </p>
            )}

            <div className="space-y-3">
              {workouts.map((w) => (
                <div
                  key={w._id}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">
                      🏋️ {w.title}
                      {w.completed && (
                        <span className="ml-2 text-xs text-emerald-600">
                          ✅ Completed
                        </span>
                      )}
                    </p>

                    <div className="flex items-center gap-3">
                      {!w.completed && (
                        <button
                          onClick={async () => {
                            await fetch(`/api/workouts/${String(w._id)}`, {
                              method: "PATCH",
                            });
                            fetchWorkouts();
                            fetchStreak(); 
                          }}
                          className="px-3 py-1 rounded-lg text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Mark Completed
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          if (!confirm("Delete this workout?")) return;
                          await fetch(`/api/workouts/${String(w._id)}`, {
                            method: "DELETE",
                          });
                          fetchWorkouts();
                          fetchStreak();
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {w.plan && (
                    <pre className="text-xs whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                      {w.plan}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
