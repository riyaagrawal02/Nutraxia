export default function Dashboard() {
  return (
    <div className="space-y-6">

      
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Today · Overview</p>
        <h2 className="text-2xl font-semibold">Welcome back, Riya 💚</h2>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Steps" value="6,830" change="+1200 today" />
        <StatCard title="Water" value="1.8 L" change="Goal: 2.5 L" />
        <StatCard title="Meals" value="3 / 4" change="Great consistency" />
        <StatCard title="Sleep" value="7.1 h" change="Ideal range" />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold mb-2">Weekly Trends</h3>
          <div className="h-56 rounded-xl bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-slate-800 dark:to-slate-900 border border-dashed flex justify-center items-center text-xs text-gray-500 dark:text-gray-400">
            Graph placeholder
          </div>
        </div>

        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Today's Routine</h3>
          <button className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800"> + Add </button></div>

          <RoutineItem name="Morning meds" time="8:00 AM" status="Done" />
          <RoutineItem name="Workout — Push Day" time="6:30 PM" status="Upcoming" />
        </div>

      </div>
    </div>
  );
}



function StatCard({ title, value, change }: any) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="text-[11px] text-emerald-500 mt-1">{change}</p>
    </div>
  );
}

function RoutineItem({ name, time, status }: any) {
  return (
    <div className="p-3 flex justify-between items-center rounded-xl bg-gray-50 dark:bg-slate-800 text-sm">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
      </div>

      <span
        className={`px-2 py-1 rounded-full text-[10px] ${
          status === "Done"
            ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
            : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
