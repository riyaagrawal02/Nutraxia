import { rangeDates, toDateString } from "@/lib/dates";

export function calculateStreak(dates: string[]) {
  if (dates.length === 0) return 0;
  const sorted = Array.from(new Set(dates)).sort().reverse();
  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }

  return streak;
}

export function calculateConsistency(
  scheduleDays: number[],
  completedDates: string[],
  start: Date,
  end: Date,
) {
  const scheduled = rangeDates(start, end).filter((date) => {
    const day = new Date(date).getDay();
    return scheduleDays.includes(day);
  });

  const completedSet = new Set(completedDates);
  const completed = scheduled.filter((date) => completedSet.has(date));

  const completionRate = scheduled.length
    ? completed.length / scheduled.length
    : 0;

  return {
    scheduledCount: scheduled.length,
    completedCount: completed.length,
    completionRate,
  };
}

export function isRecoveryAllowed(targetDate: string, windowHours: number) {
  const target = new Date(targetDate);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= windowHours;
}

export function todayString() {
  return toDateString(new Date());
}
