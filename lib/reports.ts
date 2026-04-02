import { rangeDates, toDateString } from "@/lib/dates";

export function getWeeklyRange(date = new Date()) {
  const end = new Date(date);
  const start = new Date(date);
  start.setDate(end.getDate() - 6);
  return { start, end };
}

export function getMonthlyRange(date = new Date()) {
  const end = new Date(date);
  const start = new Date(date);
  start.setDate(end.getDate() - 29);
  return { start, end };
}

export function buildDateRange(start: Date, end: Date) {
  return rangeDates(start, end).map((date) => ({
    date,
    label: date.slice(5),
  }));
}

export function periodLabel(start: Date, end: Date) {
  return `${toDateString(start)}_${toDateString(end)}`;
}
