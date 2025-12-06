import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex-1 min-h-screen bg-gray-50 dark:bg-slate-950 px-6 py-6">
        {children}
      </div>
    </div>
  );
}
