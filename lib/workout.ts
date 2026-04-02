export function estimateCaloriesBurned(
  met: number,
  weightKg: number,
  minutes: number,
) {
  const hours = minutes / 60;
  return Math.round(met * weightKg * hours);
}
