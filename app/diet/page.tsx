"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu } from "lucide-react";

const PRESET_PLANS = [
  {
    title: "Weight Loss",
    desc: "Low-calorie, balanced diet focused on fat loss",
    prompt: "Generate a simple Indian weight loss diet",
  },
  {
    title: "Weight Gain",
    desc: "Calorie surplus diet for healthy weight gain",
    prompt: "Generate a high-calorie diet for weight gain",
  },
  {
    title: "Muscle Building",
    desc: "High-protein diet for gym and strength training",
    prompt: "Generate a high-protein muscle building diet",
  },
  {
    title: "General Wellness",
    desc: "Balanced diet for overall health and energy",
    prompt: "Generate a balanced daily diet for good health",
  },
];

export default function DietPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");

  const generateDiet = async (prompt?: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt: prompt || customPrompt }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
        return;
      }

      setDietPlan(json.plan);
    } catch {
      setError("Failed to generate diet plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
              >
                <Menu size={18} />
              </button>
              <h1 className="font-semibold text-sm">AI Diet Planner</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">

          {/* PRESETS */}
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Choose a starting plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESET_PLANS.map((plan) => (
                <button
                  key={plan.title}
                  onClick={() => generateDiet(plan.prompt)}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-left hover:border-emerald-400 transition"
                >
                  <p className="font-medium">{plan.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* CUSTOM PROMPT */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Generate your own diet plan
            </h2>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Example: I want a vegetarian weight loss diet suitable for hostel life..."
              className="w-full min-h-[100px] p-4 rounded-xl border bg-white dark:bg-slate-900 text-sm"
            />

            <button
              onClick={() => generateDiet()}
              disabled={loading}
              className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
            >
              Generate AI Diet Plan
            </button>
          </section>

          {/* RESULT */}
          {loading && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 animate-pulse h-48" />
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-600">
              {error}
            </div>
          )}

          {dietPlan && (
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border">
              <p className="text-xs uppercase font-semibold text-emerald-600 mb-3">
                Your AI Diet Plan
              </p>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {dietPlan.planText}
              </pre>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
