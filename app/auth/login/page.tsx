"use client";

import { useState, ChangeEvent } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-100 via-white to-sky-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10">
        <div className="hidden md:flex flex-1 flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 w-fit text-xs">
            <span className="font-medium tracking-wide text-gray-700 dark:text-gray-200">
              Nutraxia · AI Health Companion
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Nutraxia
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-md text-sm">
            Track your health, follow your routine, and let AI nudge you
            towards better habits — all in one minimal, distraction-free space.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border border-gray-100 dark:border-white/10 px-3 py-3">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                24/7
              </p>
              <p>Smart reminders for meds, meals & workouts.</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border border-gray-100 dark:border-white/10 px-3 py-3">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                AI Insights
              </p>
              <p>Personalized routines based on your goals.</p>
            </div>
            <div className="rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border border-gray-100 dark:border-white/10 px-3 py-3">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                One Place
              </p>
              <p>Health, diet, and routine in one app.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl rounded-3xl px-8 py-8 md:py-10">
            <div className="flex flex-col items-center mb-6">
              <img src="/nutraxia.png" alt="logo" className="h-10 w-10 rounded-full "/>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                Log in to Nutraxia
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Continue your health journey
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input label="Email" name="email" onChange={handleChange} />
              <Input
                label="Password"
                type="password"
                name="password"
                onChange={handleChange}
              />

              <Button label="Login" onClick={handleLogin} />

              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Forgot password?</span>
              </div>

              <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-emerald-500 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
