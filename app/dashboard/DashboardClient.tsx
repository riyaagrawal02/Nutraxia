"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardClient({ userName }: { userName: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    steps: 0,
    water: 0,
    meals: 0,
    sleep: 0,
  });

  const [todos, setTodos] = useState<any[]>([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoTime, setTodoTime] = useState("");

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

  useEffect(() => {
    fetchDashboard();
    fetchTodos();
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
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold mb-2">Weekly Trends</h3>
              <div className="h-56 rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-dashed flex justify-center items-center text-xs text-gray-500 dark:text-gray-400">
                Graph placeholder
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-4">

              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Today's Routine</h3>
              </div>

              <div className="flex gap-2">
                <input
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  placeholder="Routine title"
                  className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                />
                <input
                  type="time"
                  value={todoTime}
                  onChange={(e) => setTodoTime(e.target.value)}
                  className="px-2 rounded-lg text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                />
                <button
                  onClick={async () => {
                    if (!todoTitle) return;
                    await fetch("/api/todos", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ title: todoTitle, time: todoTime }),
                    });
                    setTodoTitle("");
                    setTodoTime("");
                    fetchTodos();
                  }}
                  className="px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  +
                </button>
              </div>
              <div className="space-y-2">
                {todos.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No routines added yet.
                  </p>
                )}

                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800"
                  >
                    <div>
                      <p
                        className={`text-sm ${todo.completed ? "line-through opacity-60" : ""
                          }`}
                      >
                        {todo.title}
                      </p>
                      {todo.time && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {todo.time}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await fetch(`/api/todos/${todo._id}`, { method: "PATCH" });
                          fetchTodos();
                        }}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Done
                      </button>

                      <button
                        onClick={async () => {
                          await fetch(`/api/todos/${todo._id}`, { method: "DELETE" });
                          fetchTodos();
                        }}
                        className="text-xs text-red-500 hover:underline"
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



