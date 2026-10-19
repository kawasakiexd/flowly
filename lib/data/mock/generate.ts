import { eachUtcDay, fromISODate, todayUtc } from "@/lib/dates";
import {
  bucketForDay,
  bucketStarts,
  minDataDate,
  previousRange,
} from "@/lib/data/range";
import type {
  DateRange,
  Kpi,
  Order,
  OrderStatus,
  OrdersPage,
  OrdersQuery,
  TimeSeries,
  TrafficSlice,
  TrafficSource,
} from "@/lib/data/types";
import {
  EMAIL_DOMAINS,
  FIRST_NAMES,
  FIRST_ORDER_NUMBER,
  LAST_NAMES,
  ORDER_SLOT,
  SOURCE_WEIGHTS,
} from "@/lib/data/mock/catalog";
import { hashString, mulberry32, pickWeighted } from "@/lib/data/mock/prng";

export interface DayData {
  day: string;
  sessions: number;
  sessionsBySource: Record<TrafficSource, number>;
  conversion: number;
  orders: Order[];
}

const cache = new Map<string, DayData>();
const CACHE_LIMIT = 800;

function fourthThursdayOfNovember(year: number): Date {
  const first = new Date(Date.UTC(year, 10, 1));
  const weekday = first.getUTCDay();
  const firstThursday = 1 + ((4 - weekday + 7) % 7);
  return new Date(Date.UTC(year, 10, firstThursday + 21));
}

function isBlackFriday(date: Date): boolean {
  const thanksgiving = fourthThursdayOfNovember(date.getUTCFullYear());
  return (
    date.getUTCMonth() === 10 &&
    date.getUTCDate() === thanksgiving.getUTCDate() + 1
  );
}

function isCyberMonday(date: Date): boolean {
  const thanksgiving = fourthThursdayOfNovember(date.getUTCFullYear());
  return (
    date.getUTCMonth() === 10 &&
    date.getUTCDate() === thanksgiving.getUTCDate() + 4
  );
}

function isBfcmWeek(date: Date): boolean {
  const thanksgiving = fourthThursdayOfNovember(date.getUTCFullYear());
  const start = thanksgiving.getUTCDate() - 1;
  const end = thanksgiving.getUTCDate() + 5;
  return (
    date.getUTCMonth() === 10 &&
    date.getUTCDate() >= start &&
    date.getUTCDate() <= end
  );
}

function pickCustomer(rng: () => number) {
  const first = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)]!;
  const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)]!;
  const domain = EMAIL_DOMAINS[Math.floor(rng() * EMAIL_DOMAINS.length)]!;
  const local = `${first}.${last}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w.]+/g, "");
  return {
    name: `${first} ${last}`,
    email: `${local}@${domain}`,
  };
}

function pickStatus(rng: () => number, ageDays: number): OrderStatus {
  const roll = rng();
  if (roll < 0.04) {
    return "cancelled";
  }
  if (roll < 0.1) {
    return "refunded";
  }
  if (roll < 0.18) {
    return ageDays <= 3 ? "pending" : "fulfilled";
  }
  if (roll < 0.38) {
    return "paid";
  }
  return "fulfilled";
}

function lognormalish(rng: () => number): number {
  const u = Math.max(rng(), 1e-6);
  const v = Math.max(rng(), 1e-6);
  const gaussian = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.exp(gaussian * 0.35);
}

function dayIndexFromStart(day: string): number {
  const from = fromISODate(minDataDate()).getTime();
  const to = fromISODate(day).getTime();
  return Math.round((to - from) / 86_400_000);
}

export function generateDay(day: string): DayData {
  const cached = cache.get(day);
  if (cached) {
    return cached;
  }

  const rng = mulberry32(hashString(`flowly-v1:${day}`));
  const date = fromISODate(day);
  const today = todayUtc();
  const weekday = date.getUTCDay();
  const weekendFactor = weekday === 0 || weekday === 6 ? 1.15 : 1;
  const ageFromOldest = dayIndexFromStart(day);
  const growth = 1.35 ** (ageFromOldest / 365);
  let seasonal = 1;
  if (date.getUTCMonth() === 11) {
    seasonal *= 1.2;
  }
  if (isBlackFriday(date) || isCyberMonday(date)) {
    seasonal *= 2.8;
  } else if (isBfcmWeek(date)) {
    seasonal *= 1.4;
  }
  const noise = 0.88 + rng() * 0.24;
  const sessions = Math.max(
    400,
    Math.round(1800 * weekendFactor * growth * seasonal * noise),
  );

  const sourceNoise = Object.fromEntries(
    (Object.keys(SOURCE_WEIGHTS) as TrafficSource[]).map((source) => [
      source,
      Math.max(0.4, SOURCE_WEIGHTS[source] * (0.85 + rng() * 0.3)),
    ]),
  ) as Record<TrafficSource, number>;
  const sourceTotal = Object.values(sourceNoise).reduce(
    (sum, value) => sum + value,
    0,
  );
  const sessionsBySource = Object.fromEntries(
    (Object.keys(sourceNoise) as TrafficSource[]).map((source) => [
      source,
      Math.round((sourceNoise[source] / sourceTotal) * sessions),
    ]),
  ) as Record<TrafficSource, number>;

  const conversion = 0.021 + rng() * 0.012;
  const orderCount = Math.max(0, Math.round(sessions * conversion));
  const ageDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);
  const index = dayIndexFromStart(day);

  const orders: Order[] = [];
  for (let i = 0; i < orderCount; i += 1) {
    const hour = Math.min(23, Math.floor(10 + rng() * 12));
    const minute = Math.floor(rng() * 60);
    const created = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        hour,
        minute,
        Math.floor(rng() * 60),
      ),
    );
    const aovBase = 62 + rng() * 33;
    const total = Math.round(
      Math.min(64000, Math.max(1200, aovBase * 100 * lognormalish(rng))),
    );
    orders.push({
      id: `ord_${day.replaceAll("-", "")}_${String(i).padStart(3, "0")}`,
      number: `#FL-${FIRST_ORDER_NUMBER + index * ORDER_SLOT + i}`,
      createdAt: created.toISOString(),
      customer: pickCustomer(rng),
      source: pickWeighted(rng, sourceNoise),
      status: pickStatus(rng, ageDays),
      items: 1 + Math.floor(rng() * 4),
      totalCents: total,
      currency: "USD",
    });
  }

  const data: DayData = { day, sessions, sessionsBySource, conversion, orders };
  cache.set(day, data);
  if (cache.size > CACHE_LIMIT) {
    const first = cache.keys().next().value;
    if (first) {
      cache.delete(first);
    }
  }
  return data;
}

function daysIn(range: DateRange): DayData[] {
  return eachUtcDay(range.from, range.to).map(generateDay);
}

function isRevenueStatus(status: OrderStatus): boolean {
  return status === "paid" || status === "fulfilled" || status === "pending";
}

function aggregates(days: DayData[]) {
  let sessions = 0;
  let revenue = 0;
  let orders = 0;
  const sparkline: number[] = [];

  for (const day of days) {
    sessions += day.sessions;
    const counted = day.orders.filter((order) => order.status !== "cancelled");
    const dayRevenue = day.orders
      .filter((order) => isRevenueStatus(order.status))
      .reduce((sum, order) => sum + order.totalCents, 0);
    revenue += dayRevenue;
    orders += counted.length;
    sparkline.push(dayRevenue);
  }

  const aov = orders === 0 ? 0 : revenue / orders;
  const conversion = sessions === 0 ? 0 : orders / sessions;
  return { sessions, revenue, orders, aov, conversion, sparkline };
}

function downsample(values: number[], max = 60): number[] {
  if (values.length <= max) {
    return values;
  }
  const result: number[] = [];
  const step = (values.length - 1) / (max - 1);
  for (let i = 0; i < max; i += 1) {
    result.push(values[Math.round(i * step)] ?? 0);
  }
  return result;
}

function relativeDelta(current: number, previous: number): number | null {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return ((current - previous) / previous) * 100;
}

export function kpisForRange(range: DateRange): Kpi[] {
  const current = aggregates(daysIn(range));
  const previous = aggregates(daysIn(previousRange(range)));

  return [
    {
      id: "revenue",
      value: current.revenue,
      previous: previous.revenue,
      delta: relativeDelta(current.revenue, previous.revenue),
      deltaKind: "relative",
      sparkline: downsample(current.sparkline),
    },
    {
      id: "orders",
      value: current.orders,
      previous: previous.orders,
      delta: relativeDelta(current.orders, previous.orders),
      deltaKind: "relative",
      sparkline: downsample(
        daysIn(range).map(
          (day) =>
            day.orders.filter((order) => order.status !== "cancelled").length,
        ),
      ),
    },
    {
      id: "aov",
      value: current.aov,
      previous: previous.aov,
      delta: relativeDelta(current.aov, previous.aov),
      deltaKind: "relative",
      sparkline: downsample(
        daysIn(range).map((day) => {
          const counted = day.orders.filter(
            (order) => order.status !== "cancelled",
          );
          const revenue = day.orders
            .filter((order) => isRevenueStatus(order.status))
            .reduce((sum, order) => sum + order.totalCents, 0);
          return counted.length === 0 ? 0 : revenue / counted.length;
        }),
      ),
    },
    {
      id: "conversion",
      value: current.conversion,
      previous: previous.conversion,
      delta:
        previous.conversion === 0 && current.conversion === 0
          ? 0
          : (current.conversion - previous.conversion) * 100,
      deltaKind: "points",
      sparkline: downsample(
        daysIn(range).map((day) => {
          const orders = day.orders.filter(
            (order) => order.status !== "cancelled",
          ).length;
          return day.sessions === 0 ? 0 : orders / day.sessions;
        }),
      ),
    },
  ];
}

function seriesFor(
  range: DateRange,
  valueOf: (day: DayData) => number,
): TimeSeries {
  const previous = previousRange(range);
  const currentDays = daysIn(range);
  const previousDays = daysIn(previous);
  const starts = bucketStarts(range);
  const prevStarts = bucketStarts(previous);

  const currentBuckets = new Map<string, number>();
  for (const day of currentDays) {
    const bucket = bucketForDay(day.day, range.granularity, range.from);
    currentBuckets.set(
      bucket,
      (currentBuckets.get(bucket) ?? 0) + valueOf(day),
    );
  }
  const previousBuckets = new Map<string, number>();
  for (const day of previousDays) {
    const bucket = bucketForDay(day.day, previous.granularity, previous.from);
    previousBuckets.set(
      bucket,
      (previousBuckets.get(bucket) ?? 0) + valueOf(day),
    );
  }

  const points = starts.map((bucket, index) => ({
    bucket,
    value: currentBuckets.get(bucket) ?? 0,
    previous: previousBuckets.get(prevStarts[index] ?? "") ?? null,
  }));

  const total = points.reduce((sum, point) => sum + point.value, 0);
  const previousTotal = points.reduce(
    (sum, point) => sum + (point.previous ?? 0),
    0,
  );

  return {
    granularity: range.granularity,
    points,
    total,
    previousTotal,
  };
}

export function revenueSeriesForRange(range: DateRange): TimeSeries {
  return seriesFor(range, (day) =>
    day.orders
      .filter((order) => isRevenueStatus(order.status))
      .reduce((sum, order) => sum + order.totalCents, 0),
  );
}

export function ordersSeriesForRange(range: DateRange): TimeSeries {
  return seriesFor(
    range,
    (day) => day.orders.filter((order) => order.status !== "cancelled").length,
  );
}

export function trafficForRange(range: DateRange): TrafficSlice[] {
  const days = daysIn(range);
  const totals: Record<TrafficSource, number> = {
    organic: 0,
    paid: 0,
    social: 0,
    email: 0,
    direct: 0,
  };
  for (const day of days) {
    for (const source of Object.keys(totals) as TrafficSource[]) {
      totals[source] += day.sessionsBySource[source];
    }
  }
  const sessions = Object.values(totals).reduce((sum, value) => sum + value, 0);
  return (Object.keys(totals) as TrafficSource[])
    .map((source) => ({
      source,
      sessions: totals[source],
      share: sessions === 0 ? 0 : totals[source] / sessions,
    }))
    .sort((a, b) => b.sessions - a.sessions);
}

export function ordersForQuery(query: OrdersQuery): OrdersPage {
  const days = daysIn(query.range);
  const all = days
    .flatMap((day) => day.orders)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const totalInRange = all.length;
  const needle = query.q.toLowerCase();

  let rows = all.filter((order) => {
    if (query.status.length > 0 && !query.status.includes(order.status)) {
      return false;
    }
    if (query.source.length > 0 && !query.source.includes(order.source)) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return (
      order.number.toLowerCase().includes(needle) ||
      order.customer.name.toLowerCase().includes(needle) ||
      order.customer.email.toLowerCase().includes(needle)
    );
  });

  const { field, direction } = query.sort;
  const dir = direction === "asc" ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    let cmp = 0;
    if (field === "createdAt") {
      cmp = a.createdAt.localeCompare(b.createdAt);
    } else if (field === "customer") {
      cmp = a.customer.name.localeCompare(b.customer.name, "en");
    } else {
      cmp = a.totalCents - b.totalCents;
    }
    if (cmp === 0) {
      cmp = a.id.localeCompare(b.id);
    }
    return cmp * dir;
  });

  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * query.pageSize;

  return {
    rows: rows.slice(start, start + query.pageSize),
    total,
    totalInRange,
    page,
    pageSize: query.pageSize,
    pageCount,
  };
}
