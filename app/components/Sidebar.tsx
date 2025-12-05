"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Calendar, Settings, UtensilsCrossed, Dumbbell } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Health Profile", href: "/profile", icon: Activity },
  { name: "Diet Plan", href: "/diet", icon: UtensilsCrossed },
  { name: "Workout Plan", href: "/workout", icon: Dumbbell },
  { name: "Reminders", href: "/reminders", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 px-5 py-6 hidden md:flex flex-col">
      
      <div className="flex items-center gap-3 mb-10">
        <img src="/nutraxia.png" className="h-9 w-9 rounded-full" />
        <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
          Nutraxia
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition 
              ${active
                ? "bg-emerald-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"}
              `}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      
      <div className="mt-auto text-xs text-gray-400 dark:text-gray-500">
        © {new Date().getFullYear()} Nutraxia
      </div>
    </div>
  );
}
