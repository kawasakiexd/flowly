import { UTCDate } from "@date-fns/utc";

export function todayUtc(): UTCDate {
  const now = new UTCDate();
  return new UTCDate(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromISODate(iso: string): UTCDate {
  return new UTCDate(`${iso}T00:00:00.000Z`);
}

export function addUtcDays(date: Date, days: number): UTCDate {
  const next = new UTCDate(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function diffUtcDays(from: Date, to: Date): number {
  const fromUtc = Date.UTC(
    from.getUTCFullYear(),
    from.getUTCMonth(),
    from.getUTCDate(),
  );
  const toUtc = Date.UTC(
    to.getUTCFullYear(),
    to.getUTCMonth(),
    to.getUTCDate(),
  );
  return Math.round((toUtc - fromUtc) / 86_400_000);
}

export function isValidIsoDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(fromISODate(value).getTime())
  );
}

export function clampIsoDate(iso: string, min: string, max: string): string {
  if (iso < min) {
    return min;
  }
  if (iso > max) {
    return max;
  }
  return iso;
}

export function eachUtcDay(from: string, to: string): string[] {
  const days: string[] = [];
  let cursor = fromISODate(from);
  const end = fromISODate(to);
  while (cursor.getTime() <= end.getTime()) {
    days.push(toISODate(cursor));
    cursor = addUtcDays(cursor, 1);
  }
  return days;
}

export function startOfUtcWeekMonday(date: Date): UTCDate {
  const day = date.getUTCDay();
  const offset = day === 0 ? 6 : day - 1;
  return addUtcDays(date, -offset);
}

export function startOfUtcMonth(date: Date): UTCDate {
  return new UTCDate(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}
