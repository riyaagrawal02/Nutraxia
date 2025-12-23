"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";


export default function DashboardClient({ userName }: { userName: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const [stats, setStats] = useState({
    steps: 0,
    water: 0,
    meals: 0,
    sleep: 0,
  });

  const [todos, setTodos] = useState<any[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoTime, setTodoTime] = useState("");
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(true);


  const fetchWeekly = async () => {
    const res = await fetch("/api/dashboard/weekly");
    const json = await res.json();
    setWeeklyData(json.data);
  };

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const json = await res.json();
    setTodos(json.todos);
  };


  const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard");
    const json = await res.json();
    setStats(json.stats);
  };

  const fetchAISummary = async () => {
    setAiLoading(true);
    const res = await fetch("/api/ai/daily-summary");
    const json = await res.json();
    setAiSummary(json.summary);
    setAiLoading(false);
  };

  const fetchProfileCompletion = async () => {
    const res = await fetch("/api/profile/completion");
    const json = await res.json();
    setProfileCompletion(json.completion);
  };

  useEffect(() => {
    fetchDashboard();
    fetchTodos();
    fetchWeekly();
    fetchAISummary();
    fetchProfileCompletion();
  }, []);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-50">

        <header className="border-b border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                <Menu size={18} />
              </button>

              <div className="flex items-center gap-2">
                <img src="/nutraxia.png" className="h-8 w-8 rounded-xl" alt="Logo" />
                <div>
                  <h1 className="font-semibold text-sm">Nutraxia</h1>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Smart health & habit companion
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white">
                {userName?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>


        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today · Overview</p>
            <h2 className="text-2xl font-semibold">Welcome back, {userName} 💚</h2>
          </div>


          {profileCompletion < 70 ? (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 p-4">
              <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-300 mb-1">
                AI Locked
              </p>

              <p className="text-sm text-gray-700 dark:text-gray-200">
                Complete at least <b>70%</b> of your health profile to unlock AI insights.
              </p>

              <div className="mt-3">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Profile completion: {profileCompletion}%
                </p>
              </div>

              <a
                href="/profile"
                className="inline-block mt-3 text-xs font-semibold text-amber-700 hover:underline"
              >
                Complete Profile →
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 p-4">
              <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300 mb-1">
                AI Daily Insight
              </p>

              {aiLoading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-emerald-200/60 rounded animate-pulse" />
                  <div className="h-3 bg-emerald-200/60 rounded animate-pulse w-4/5" />
                </div>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {aiSummary}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Steps" value={stats.steps} change="Today" />
            <StatCard
              title="Water"
              value={`${stats.water} L`}
              change={
                <button
                  onClick={async () => {
                    await fetch("/api/log/water", { method: "POST" });
                    fetchDashboard();
                  }}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  + Add Water
                </button>
              }
            />

            <StatCard
              title="Meals"
              value={stats.meals}
              change={
                <button
                  onClick={async () => {
                    await fetch("/api/log/meal", { method: "POST" });
                    fetchDashboard();
                  }}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  + Add Meal
                </button>
              }
            />

            <StatCard title="Sleep" value={`${stats.sleep} h`} change="Last night" />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2 space-y-4">

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold mb-3">Weekly Steps</h3>

                {weeklyData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                    No data yet
                  </div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="steps"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold mb-3">
                  Water & Sleep Balance
                </h3>

                {weeklyData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                    No data yet
                  </div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="water"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>



            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold">Today’s Routine</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Keep track of meds, workouts & habits
                  </p>
                </div>
              </div>

              <div className="flex justify-center flex-wrap  gap-2">
                <input
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  placeholder="e.g. Morning meds"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && todoTitle) {
                      document.getElementById("addRoutineBtn")?.click();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 outline-none"
                />

                <input
                  type="time"
                  value={todoTime}
                  onChange={(e) => setTodoTime(e.target.value)}
                  className="px-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 outline-none"
                />

                <button
                  id="addRoutineBtn"
                  disabled={!todoTitle}
                  onClick={async () => {
                    await fetch("/api/todos", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ title: todoTitle, time: todoTime }),
                    });
                    setTodoTitle("");
                    setTodoTime("");
                    fetchTodos();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium transition"
                >
                  Add
                </button>
              </div>

              {todos.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
                  No routines yet. Start by adding one 👆
                </div>
              )}


              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800 transition hover:shadow-sm"
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${todo.completed ? "line-through opacity-60" : ""
                          }`}
                      >
                        {todo.title}
                      </p>

                      {todo.time && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ⏰ {todo.time}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!todo.completed && (
                        <button
                          onClick={async () => {
                            console.log("SENDING ID:", todo._id);

                            const res = await fetch(`/api/todos/${todo._id}`, { method: "PATCH" });
                            if (!res.ok) {
                              const err = await res.text();
                              console.error("Todo update failed:", err);
                              alert("Failed to update routine. Check console.");
                              return;
                            }

                            fetchTodos();
                          }}
                          className="px-2 py-1 rounded-lg text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:opacity-80"
                        >
                          Done
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          await fetch(`/api/todos/${todo._id}`, { method: "DELETE" });
                          fetchTodos();
                          console.log(todo._id);
                        }}
                        className="px-2 py-1 rounded-lg text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 hover:opacity-80"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({ title, value, change }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
      <div className="mt-1">{change}</div>
    </div>
  );
}



