export function calculateWorkoutStreak(dates: Date[]) {
  if (dates.length === 0) return 0;


  const days = Array.from(
    new Set(dates.map(d => d.toISOString().slice(0, 10)))
  ).sort().reverse();

  let streak = 1;

  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);

    const diff =
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }

  return streak;
}
