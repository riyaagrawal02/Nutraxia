"use client";

import ThemeToggle from "@/app/components/ThemeToggle";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-50">
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/nutraxia.png" alt="logo" className="h-8 w-8 rounded-xl" />
            <div>
              <h1 className="font-semibold text-sm">Nutraxia</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Smart health & habit companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-semibold text-white">
              R
            </div>
          </div>
        </div>
      </header>

     
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Today · Health overview
            </p>
            <h2 className="text-2xl font-semibold mt-1">
              Hey Riya, let’s keep your streak alive 💚
            </h2>
          </div>

          <div className="flex gap-3 text-xs">
            <div className="px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
              Streak: <span className="font-semibold">5 days</span>
            </div>
            <div className="px-3 py-2 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800">
              Wellness score: <span className="font-semibold">78/100</span>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Steps today
            </p>
            <p className="text-2xl font-semibold mt-1">6,830</p>
            <p className="text-[11px] text-emerald-500 mt-1">
              +1,200 vs yesterday
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Water intake
            </p>
            <p className="text-2xl font-semibold mt-1">1.8 L</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Target: 2.5 L
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Meals followed
            </p>
            <p className="text-2xl font-semibold mt-1">3 / 4</p>
            <p className="text-[11px] text-emerald-500 mt-1">
              Great consistency
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sleep last night
            </p>
            <p className="text-2xl font-semibold mt-1">7.1 h</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Ideal range
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Weekly overview
                </p>
                <h3 className="text-sm font-semibold">Energy & activity</h3>
              </div>
              <select className="text-xs bg-transparent border border-gray-200 dark:border-slate-700 rounded-full px-2 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            
            <div className="h-48 rounded-xl bg-linear-to-tr from-emerald-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-dashed border-emerald-200/70 dark:border-slate-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              Graph placeholder – integrate Recharts/Chart.js later
            </div>
          </div>

          
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today’s routine
                </p>
                <h3 className="text-sm font-semibold">Reminders</h3>
              </div>
              <button className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                + Add
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                <div>
                  <p className="font-medium">Morning meds</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    8:00 AM · After breakfast
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  Done
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-slate-800">
                <div>
                  <p className="font-medium">Workout</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    6:30 PM · Push day
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px]">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
