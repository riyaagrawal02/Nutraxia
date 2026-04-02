export function toDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function rangeDates(start: Date, end: Date) {
  const result: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    result.push(toDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
}
