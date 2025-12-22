"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, RefreshCcw } from "lucide-react";

const PRESET_PLANS = [
  {
    title: "Weight Loss",
    desc: "Low-calorie balanced diet focused on fat loss",
    prompt: "Generate a simple Indian weight loss diet plan",
  },
  {
    title: "Weight Gain",
    desc: "Calorie surplus diet for healthy weight gain",
    prompt: "Generate a high-calorie Indian diet for weight gain",
  },
  {
    title: "Muscle Building",
    desc: "High-protein diet for gym & strength training",
    prompt: "Generate a high-protein muscle building diet",
  },
  {
    title: "General Wellness",
    desc: "Balanced diet for energy and overall health",
    prompt: "Generate a balanced daily Indian diet for wellness",
  },
];

export default function DietPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [diet, setDiet] = useState<any>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

 
  const fetchDiet = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/diet");
      const json = await res.json();
      setDiet(json.plan);
    } catch {
      setError("Failed to load diet plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, []);

  const generateDiet = async (prompt?: string) => {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/diet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrompt: prompt }),
      });

      const json = await res.json();

      if (json.error) {
        setError(json.error);
        return;
      }

      setDiet(json.plan);
    } catch {
      setError("AI diet generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
        
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

          
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Choose a starting plan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESET_PLANS.map((plan) => (
                <button
                  key={plan.title}
                  onClick={() => generateDiet(plan.prompt)}
                  disabled={generating}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border text-left hover:border-emerald-400 transition"
                >
                  <p className="font-medium">{plan.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

         
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Generate a custom diet plan
            </h2>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Example: Vegetarian weight loss diet suitable for hostel life"
              className="w-full min-h-[110px] p-4 rounded-xl border bg-white dark:bg-slate-900 text-sm"
            />

            <button
              onClick={() => generateDiet(customPrompt)}
              disabled={generating || !customPrompt}
              className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate AI Diet Plan"}
            </button>
          </section>

          
          {loading && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 animate-pulse h-48" />
          )}

         
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 text-sm">
              {error}
            </div>
          )}

          
          {diet && (
            <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs uppercase font-semibold text-emerald-600">
                  Today’s AI Diet Plan
                </p>
                <button
                  onClick={() => generateDiet()}
                  disabled={generating}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  <RefreshCcw size={14} />
                  Regenerate
                </button>
              </div>

              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {diet.planText}
              </pre>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
