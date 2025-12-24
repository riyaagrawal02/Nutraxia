"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, LogOut, ChevronRight, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        
        <header className="border-b bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-sm font-semibold">⚙️ Settings</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">

          
          <Section title="Account">
            <Row
              label="Edit Profile"
              action="Open"
              onClick={() => (window.location.href = "/profile")}
            />

            <Row
              label="Logout"
              icon={<LogOut size={16} />}
              danger
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            />
          </Section>

        
          <Section title="Appearance">
            <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900 border">
              <p className="text-sm font-medium">Theme</p>
              <ThemeToggle />
            </div>
          </Section>

          <Section title="Preferences">
            <ToggleRow
              label="Reminders"
              checked={remindersEnabled}
              onChange={setRemindersEnabled}
            />

            <ToggleRow
              label="AI Insights"
              checked={aiEnabled}
              onChange={setAiEnabled}
            />

            <ToggleRow
              label="Weekly Health Report"
              checked={weeklyReport}
              onChange={setWeeklyReport}
            />
          </Section>

          
          <Section title="Security">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium truncate">
                user@email.com
              </p>
            </div>

            <Row
              label="Change Password"
              action="Coming soon"
            />
          </Section>

         
          <Section title="Danger Zone">
            <Row
              label="Clear All Data"
              icon={<Trash2 size={16} />}
              danger
              onClick={() => alert("API coming soon")}
            />

            <Row
              label="Delete Account"
              icon={<Trash2 size={16} />}
              danger
              onClick={() =>
                confirm("This will permanently delete your account.")
              }
            />
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
      <h2 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({
  label,
  action,
  onClick,
  icon,
  danger,
}: {
  label: string;
  action?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center p-4 rounded-xl border bg-white dark:bg-slate-900 ${
        danger
          ? "border-red-200 dark:border-red-900"
          : "border-gray-200 dark:border-slate-800"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p
          className={`text-sm font-medium ${
            danger ? "text-red-600" : ""
          }`}
        >
          {label}
        </p>
      </div>
      {action ? (
        <span className="text-xs text-gray-500">{action}</span>
      ) : (
        <ChevronRight size={16} />
      )}
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-xl bg-white dark:bg-slate-900 border">
      <p className="text-sm font-medium">{label}</p>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-emerald-600"
      />
    </div>
  );
}
