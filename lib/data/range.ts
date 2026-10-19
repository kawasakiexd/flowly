import { UTCDate } from "@date-fns/utc";

import {
  addUtcDays,
  clampIsoDate,
  diffUtcDays,
  fromISODate,
  isValidIsoDate,
  startOfUtcMonth,
  startOfUtcWeekMonday,
  toISODate,
  todayUtc,
} from "@/lib/dates";
import type {
  DateRange,
  Granularity,
  OrdersQuery,
  OrderSortField,
  OrderStatus,
  RangePreset,
  SortDirection,
  TrafficSource,
} from "@/lib/data/types";
import {
  ORDER_SORT_FIELDS,
  ORDER_STATUSES,
  TRAFFIC_SOURCES,
} from "@/lib/data/types";

export const PRESET_DAYS: Record<RangePreset, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "12m": 365,
};

export const PRESET_LABELS: Record<RangePreset, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
};

export const PRESET_SHORT: Record<RangePreset, string> = {
  "7d": "7D",
  "30d": "30D",
  "90d": "90D",
  "12m": "12M",
};

export const COMPARISON_LABELS: Record<RangePreset, string> = {
  "7d": "vs. previous 7 days",
  "30d": "vs. previous 30 days",
  "90d": "vs. previous 90 days",
  "12m": "vs. previous 12 months",
};

function granularityForDays(days: number): Granularity {
  if (days <= 31) {
    return "day";
  }
  if (days <= 120) {
    return "week";
  }
  return "month";
}

function utcMonth(year: number, month: number): UTCDate {
  return new UTCDate(Date.UTC(year, month, 1));
}

export function minDataDate(): string {
  return toISODate(addUtcDays(todayUtc(), -729));
}

export function maxSelectableDate(): string {
  return toISODate(todayUtc());
}

export function minSelectableDate(): string {
  return toISODate(addUtcDays(todayUtc(), -365));
}

export function resolveRange(
  preset: RangePreset | "custom" = "30d",
  from?: string | null,
  to?: string | null,
): DateRange {
  const today = maxSelectableDate();
  const minSelect = minSelectableDate();

  if (preset !== "custom") {
    const days = PRESET_DAYS[preset];
    const rangeTo = today;
    const rangeFrom = toISODate(addUtcDays(fromISODate(rangeTo), -(days - 1)));
    return {
      preset,
      from: rangeFrom,
      to: rangeTo,
      days,
      granularity: granularityForDays(days),
    };
  }

  if (
    !from ||
    !to ||
    !isValidIsoDate(from) ||
    !isValidIsoDate(to) ||
    from > to
  ) {
    return resolveRange("30d");
  }

  const clampedFrom = clampIsoDate(from, minSelect, today);
  const clampedTo = clampIsoDate(to, minSelect, today);
  if (clampedFrom > clampedTo) {
    return resolveRange("30d");
  }

  const days =
    diffUtcDays(fromISODate(clampedFrom), fromISODate(clampedTo)) + 1;
  if (days > 365) {
    const adjustedFrom = toISODate(addUtcDays(fromISODate(clampedTo), -364));
    return {
      preset: "custom",
      from: adjustedFrom,
      to: clampedTo,
      days: 365,
      granularity: granularityForDays(365),
    };
  }

  return {
    preset: "custom",
    from: clampedFrom,
    to: clampedTo,
    days,
    granularity: granularityForDays(days),
  };
}

export function previousRange(range: DateRange): DateRange {
  const prevTo = toISODate(addUtcDays(fromISODate(range.from), -1));
  const prevFrom = toISODate(
    addUtcDays(fromISODate(prevTo), -(range.days - 1)),
  );
  return {
    preset: "custom",
    from: prevFrom,
    to: prevTo,
    days: range.days,
    granularity: range.granularity,
  };
}

export function bucketStarts(range: DateRange): string[] {
  const start = fromISODate(range.from);
  const end = fromISODate(range.to);

  if (range.granularity === "day") {
    const buckets: string[] = [];
    let cursor = start;
    while (cursor.getTime() <= end.getTime()) {
      buckets.push(toISODate(cursor));
      cursor = addUtcDays(cursor, 1);
    }
    return buckets;
  }

  if (range.granularity === "week") {
    const buckets: string[] = [];
    let cursor = startOfUtcWeekMonday(start);
    if (toISODate(start) < toISODate(cursor)) {
      buckets.push(toISODate(start));
    } else if (cursor.getTime() < start.getTime()) {
      cursor = addUtcDays(cursor, 7);
      buckets.push(toISODate(start));
    }
    while (cursor.getTime() <= end.getTime()) {
      buckets.push(toISODate(cursor));
      cursor = addUtcDays(cursor, 7);
    }
    return [...new Set(buckets)];
  }

  const buckets: string[] = [];
  let cursor = startOfUtcMonth(start);
  if (toISODate(start) < toISODate(cursor)) {
    buckets.push(toISODate(start));
  } else if (cursor.getTime() < start.getTime()) {
    cursor = utcMonth(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1);
    buckets.push(toISODate(start));
  }
  while (cursor.getTime() <= end.getTime()) {
    buckets.push(toISODate(cursor));
    cursor = utcMonth(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1);
  }
  return [...new Set(buckets)];
}

export function bucketForDay(
  day: string,
  granularity: Granularity,
  rangeFrom: string,
): string {
  if (granularity === "day") {
    return day;
  }
  const date = fromISODate(day);
  if (granularity === "week") {
    const weekStart = toISODate(startOfUtcWeekMonday(date));
    return weekStart < rangeFrom ? rangeFrom : weekStart;
  }
  const monthStart = toISODate(startOfUtcMonth(date));
  return monthStart < rangeFrom ? rangeFrom : monthStart;
}

export function comparisonLabel(range: DateRange): string {
  if (range.preset === "custom") {
    return "vs. previous period";
  }
  return COMPARISON_LABELS[range.preset];
}

export function parseSort(value: string | null | undefined): {
  field: OrderSortField;
  direction: SortDirection;
} {
  const [field, direction] = (value ?? "createdAt.desc").split(".");
  const safeField = ORDER_SORT_FIELDS.includes(field as OrderSortField)
    ? (field as OrderSortField)
    : "createdAt";
  const safeDirection: SortDirection = direction === "asc" ? "asc" : "desc";
  return { field: safeField, direction: safeDirection };
}

export function toOrdersQuery(input: {
  range: DateRange;
  q?: string | null;
  status?: string[] | null;
  source?: string[] | null;
  sort?: string | null;
  page?: number | null;
  size?: number | null;
}): OrdersQuery {
  const q = (input.q ?? "").trim().slice(0, 100);
  const status = (input.status ?? []).filter((item): item is OrderStatus =>
    ORDER_STATUSES.includes(item as OrderStatus),
  );
  const source = (input.source ?? []).filter((item): item is TrafficSource =>
    TRAFFIC_SOURCES.includes(item as TrafficSource),
  );
  const pageSize =
    input.size === 10 || input.size === 20 || input.size === 50
      ? input.size
      : 10;
  const page = Math.max(1, input.page ?? 1);

  return {
    range: input.range,
    q,
    status,
    source,
    sort: parseSort(input.sort),
    page,
    pageSize,
  };
}
