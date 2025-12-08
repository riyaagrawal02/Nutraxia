"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Calendar,
  Settings,
  UtensilsCrossed,
  Dumbbell
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Health Profile", href: "/profile", icon: Activity },
  { label: "Diet Plan", href: "/diet", icon: UtensilsCrossed },
  { label: "Workout Plan", href: "/workout", icon: Dumbbell },
  { label: "Reminders", href: "/reminders", icon: Calendar },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white border-r border-slate-800 z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
         
          <div className="flex items-center gap-3 mb-10">
            <img src="/nutraxia.png" className="h-10 w-10 rounded-xl" />
            <h2 className="text-xl font-semibold text-emerald-400">
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
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-slate-800 text-gray-300"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="text-xs px-3 py-2 my-5 rounded-full border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
    >
      Logout
    </button>


          <p className="mt-auto text-xs text-slate-500">
            © {new Date().getFullYear()} Nutraxia
          </p>
        </div>
      </div>
    </>
  );
}
