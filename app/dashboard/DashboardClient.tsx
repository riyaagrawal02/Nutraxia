"use client";
/* eslint-disable react-hooks/set-state-in-effect */
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

type Stats = {
  steps: number;
  water: number;
  meals: number;
  sleep: number;
};

type HealthPoint = {
  date: string;
  calories: number;
  weight: number | null;
  water: number;
  sleepHours: number;
  steps: number;
  workoutMinutes: number;
  healthScore: number;
};

type HabitSummary = {
  habitId: string;
  title: string;
  completionRate: number;
  completedCount: number;
  scheduledCount: number;
  streak: number;
};

type HabitItem = {
  habit: {
    _id: string;
    title: string;
    difficulty: string;
    scheduleDays: number[];
  };
  stats: {
    streak: number;
    completionRate: number;
    completedCount: number;
    scheduledCount: number;
  };
};

type HeatmapDay = { date: string; count: number };

type ReportSummary = {
  periodStart: string;
  periodEnd: string;
  habitCompletionPct: number;
  workoutHours: number;
  caloriesTotal: number;
  weightChange: number | null;
  healthScoreAvg: number;
  consistencyScore: number;
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function DashboardClient({ userName }: { userName: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [stats, setStats] = useState<Stats>({
    steps: 0,
    water: 0,
    meals: 0,
    sleep: 0,
  });

  const [todos, setTodos] = useState<
    Array<{
      _id: string;
      title: string;
      time?: string;
      completed: boolean;
    }>
  >([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoTime, setTodoTime] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(true);

  const [healthSeries, setHealthSeries] = useState<HealthPoint[]>([]);
  const [habitCompletion, setHabitCompletion] = useState<HabitSummary[]>([]);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [weeklyReport, setWeeklyReport] = useState<ReportSummary | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<ReportSummary | null>(null);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);

  const [habitTitle, setHabitTitle] = useState("");
  const [habitDifficulty, setHabitDifficulty] = useState("easy");
  const [habitDays, setHabitDays] = useState<number[]>([1, 3, 5]);


  const fetchAnalytics = async () => {
    const res = await fetch("/api/analytics/dashboard?days=30");
    const json = await res.json();
    setHealthSeries(json.healthSeries || []);
    setHabitCompletion(json.habitCompletion || []);
    setWorkoutStreak(json.workoutStreak || 0);
  };

  const fetchReports = async () => {
    const [weeklyRes, monthlyRes] = await Promise.all([
      fetch("/api/reports/weekly"),
      fetch("/api/reports/monthly"),
    ]);

    const weeklyJson = await weeklyRes.json();
    const monthlyJson = await monthlyRes.json();
    setWeeklyReport(weeklyJson.report?.summary || null);
    setMonthlyReport(monthlyJson.report?.summary || null);
  };

  const fetchHabits = async () => {
    const res = await fetch("/api/habits");
    const json = await res.json();
    setHabits(json.data || []);
  };

  const fetchHeatmap = async () => {
    const res = await fetch("/api/habits/heatmap");
    const json = await res.json();
    setHeatmapDays(json.days || []);
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
    fetchAISummary();
    fetchProfileCompletion();
    fetchAnalytics();
    fetchReports();
    fetchHabits();
    fetchHeatmap();
  }, []);

  const chartSeries = healthSeries.map((point) => ({
    date: point.date.slice(5),
    steps: point.steps,
    water: Number((point.water / 1000).toFixed(2)),
    sleep: point.sleepHours,
    healthScore: point.healthScore,
    weight: point.weight,
    calories: point.calories,
  }));

  const avgHabitCompletion = habitCompletion.length
    ? Math.round(
      (habitCompletion.reduce(
        (sum, habit) => sum + habit.completionRate,
        0,
      ) /
        habitCompletion.length) *
      100,
    )
    : 0;

  const getHeatColor = (count: number) => {
    if (count >= 5) return "bg-emerald-600";
    if (count >= 3) return "bg-emerald-400";
    if (count >= 1) return "bg-emerald-200";
    return "bg-gray-100 dark:bg-slate-800";
  };

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
            <StatCard
              title="Steps"
              value={stats.steps}
              change={
                <button
                  onClick={async () => {
                    const steps = prompt("Enter steps walked today:");
                    if (!steps) return;

                    await fetch("/api/log/steps", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ steps: Number(steps) }),
                    });

                    fetchDashboard();
                    fetchWeekly();
                  }}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  + Log Steps
                </button>
              }
            />

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

            <StatCard
              title="Sleep"
              value={`${stats.sleep} h`}
              change={
                <button
                  onClick={async () => {
                    const sleepFrom = prompt("Sleep time (HH:MM, 24h)");
                    const wakeAt = prompt("Wake time (HH:MM, 24h)");
                    if (!sleepFrom || !wakeAt) return;

                    await fetch("/api/log/sleep", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ sleepFrom, wakeAt }),
                    });

                    fetchDashboard();
                    fetchWeekly();
                  }}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  + Log Sleep
                </button>
              }
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              title="Habit Consistency"
              value={`${avgHabitCompletion}%`}
              change={<span className="text-xs text-gray-500">30-day average</span>}
            />
            <StatCard
              title="Workout Streak"
              value={`${workoutStreak} days`}
              change={<span className="text-xs text-gray-500">Current streak</span>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2 space-y-4">

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold mb-3">Steps & Health Score</h3>

                {chartSeries.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                    No data yet
                  </div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                      <LineChart data={chartSeries}>
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
                        <Line
                          type="monotone"
                          dataKey="healthScore"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={{ r: 2 }}
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

                {chartSeries.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-xs text-gray-500">
                    No data yet
                  </div>
                ) : (
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
                      <LineChart data={chartSeries}>
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

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold mb-3">Reports</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ReportCard title="Weekly" summary={weeklyReport} />
                  <ReportCard title="Monthly" summary={monthlyReport} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-5">


              <div>
                <h3 className="text-sm font-semibold">Today’s Routine</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Habits, workouts & medications
                </p>
              </div>


              <div className="flex flex-wrap gap-2">
                <input
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  placeholder="e.g. Morning workout"
                  className="flex-1 px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <input
                  type="time"
                  value={todoTime}
                  onChange={(e) => setTodoTime(e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                />
                <button
                  disabled={!todoTitle}
                  onClick={async () => {
                    await fetch("/api/todos", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        title: todoTitle,
                        time: todoTime,
                      }),
                    });
                    setTodoTitle("");
                    setTodoTime("");
                    fetchTodos();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium"
                >
                  Add
                </button>
              </div>
              {todos.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  No routines yet. Add one above 👆
                </p>
              )}
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
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
                    <div className="flex gap-2">
                      {!todo.completed && (
                        <button
                          onClick={async () => {
                            await fetch(`/api/todos/${todo._id}`, { method: "PATCH" });
                            fetchTodos();
                          }}
                          className="px-2 py-1 rounded-lg text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await fetch(`/api/todos/${todo._id}`, { method: "DELETE" });
                          fetchTodos();
                        }}
                        className="px-2 py-1 rounded-lg text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Habits</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create habits and log completions
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <input
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  placeholder="e.g. Morning walk"
                  className="px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-400 outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  <select
                    value={habitDifficulty}
                    onChange={(e) => setHabitDifficulty(e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {DAY_LABELS.map((label, index) => (
                      <button
                        key={label + index}
                        type="button"
                        onClick={() => {
                          setHabitDays((prev) =>
                            prev.includes(index)
                              ? prev.filter((d) => d !== index)
                              : [...prev, index]
                          );
                        }}
                        className={`h-9 w-9 rounded-xl text-xs font-semibold border ${habitDays.includes(index)
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={!habitTitle}
                    onClick={async () => {
                      await fetch("/api/habits", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: habitTitle,
                          difficulty: habitDifficulty,
                          scheduleDays: habitDays.length ? habitDays : [0, 1, 2, 3, 4, 5, 6],
                        }),
                      });
                      setHabitTitle("");
                      setHabitDays([1, 3, 5]);
                      setHabitDifficulty("easy");
                      fetchHabits();
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium"
                  >
                    Add Habit
                  </button>
                </div>
              </div>

              {habits.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No habits yet. Create one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {habits.map((item) => (
                    <div
                      key={item.habit._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.habit.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Streak {item.stats.streak} · {Math.round(item.stats.completionRate * 100)}% completion
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await fetch(`/api/habits/${item.habit._id}/logs`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({}),
                            });
                            fetchHabits();
                            fetchHeatmap();
                            fetchAnalytics();
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                        >
                          Log
                        </button>
                        <span className="text-xs px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {item.habit.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Habit Heatmap</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last 12 months of completions
                </p>
              </div>

              {heatmapDays.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-xs text-gray-500">
                  No data yet
                </div>
              ) : (
                <div className="grid grid-cols-14 gap-1">
                  {heatmapDays.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date} · ${day.count} completions`}
                      className={`h-3 w-3 rounded-sm ${getHeatColor(day.count)}`}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Low</span>
                <span className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-slate-800" />
                <span className="h-3 w-3 rounded-sm bg-emerald-200" />
                <span className="h-3 w-3 rounded-sm bg-emerald-400" />
                <span className="h-3 w-3 rounded-sm bg-emerald-600" />
                <span>High</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: React.ReactNode;
  change?: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
      <div className="mt-1">{change}</div>
    </div>
  );
}

function ReportCard({
  title,
  summary,
}: {
  title: string;
  summary: ReportSummary | null;
}) {
  if (!summary) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-slate-700 p-3 text-xs text-gray-500">
        {title} report pending
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-3 bg-gray-50 dark:bg-slate-800">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
        {title} Report
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
        <span>Habits</span>
        <span>{summary.habitCompletionPct}%</span>
        <span>Workout hrs</span>
        <span>{summary.workoutHours}</span>
        <span>Calories</span>
        <span>{summary.caloriesTotal}</span>
        <span>Health score</span>
        <span>{summary.healthScoreAvg}</span>
      </div>
    </div>
  );
}



