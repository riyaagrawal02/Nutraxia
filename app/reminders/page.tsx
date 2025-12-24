"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu } from "lucide-react";

type Todo = {
  _id: string;
  title: string;
  time?: string;
  date: string;
  completed: boolean;
};

export default function RemindersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    const res = await fetch("/api/todos");
    const json = await res.json();
    setTodos(json.todos || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const todayReminders = todos.filter(
    (t) => t.date === today && !t.completed
  );

  const upcomingReminders = todos.filter(
    (t) => t.date > today && !t.completed
  );

  const completedReminders = todos.filter((t) => t.completed);

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
            <h1 className="text-sm font-semibold">🔔 Reminders</h1>
            <ThemeToggle />
          </div>
        </header>

       
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">

         
          <Section title="Today">
            {todayReminders.map((todo) => (
              <ReminderCard
                key={todo._id}
                todo={todo}
                refresh={fetchTodos}
              />
            ))}
            {!loading && todayReminders.length === 0 && (
              <EmptyText text="No reminders for today 🎉" />
            )}
          </Section>

         
          <Section title="Upcoming">
            {upcomingReminders.map((todo) => (
              <ReminderCard
                key={todo._id}
                todo={todo}
                refresh={fetchTodos}
              />
            ))}
            {!loading && upcomingReminders.length === 0 && (
              <EmptyText text="Nothing upcoming yet." />
            )}
          </Section>

         
          <Section title="Completed">
            {completedReminders.map((todo) => (
              <ReminderCard
                key={todo._id}
                todo={todo}
                refresh={fetchTodos}
              />
            ))}
            {!loading && completedReminders.length === 0 && (
              <EmptyText text="No completed reminders yet." />
            )}
          </Section>

        </main>
      </div>
    </>
  );
}


function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {text}
    </p>
  );
}

function ReminderCard({
  todo,
  refresh,
}: {
  todo: Todo;
  refresh: () => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900 border">
      <div>
        <p
          className={`text-sm font-medium ${
            todo.completed ? "line-through opacity-60" : ""
          }`}
        >
          {todo.title}
        </p>

        {todo.time && (
          <p className="text-xs text-gray-500">
            ⏰ {todo.time} · 📅 {todo.date}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {!todo.completed && (
          <button
            onClick={async () => {
              await fetch(`/api/todos/${todo._id}`, {
                method: "PATCH",
              });
              refresh();
            }}
            className="px-3 py-1 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Done
          </button>
        )}

        <button
          onClick={async () => {
            if (!confirm("Delete this reminder?")) return;
            await fetch(`/api/todos/${todo._id}`, {
              method: "DELETE",
            });
            refresh();
          }}
          className="px-3 py-1 text-xs rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
