"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      
      <header className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/nutraxia.png" alt="logo" className="h-9 w-9 rounded-xl" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Nutraxia
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center space-y-6">
        
        <span className="px-4 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Your Personal AI Wellness Assistant
        </span>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight max-w-3xl">
          Build better routines, track your health, and let{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            AI guide your wellness
          </span>
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-xl">
          Nutraxia brings your health data, habits, diet plan, workout tracker,
          and reminders into one smart dashboard — powered by AI to help you stay consistent.
        </p>

        
        <div className="flex gap-4 mt-4">
          <Link
            href="/auth/register"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </main>

      
      <footer className="text-center py-6 text-xs text-gray-500 dark:text-gray-600">
        © {new Date().getFullYear()} Nutraxia · Built with passion 💚
      </footer>
    </div>
  );
}
