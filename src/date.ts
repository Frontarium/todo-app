export type Period = "all" | "day" | "week" | "month";

export function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  return x;
}

export function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

export function inPeriod(iso: string, period: Period, now = new Date()) {
  if (period === "all") return true;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return false;

  const n = now;
  let from: Date;

  if (period === "day") from = startOfDay(n);
  else if (period === "week") from = startOfWeek(n);
  else from = startOfMonth(n);

  return dt >= from && dt <= n;
}
