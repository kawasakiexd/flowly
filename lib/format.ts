const MINUS = "\u2212";

const integerFormatter = new Intl.NumberFormat("en-US");

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const moneyNoCentsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const orderDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) >= 1000) {
    return moneyNoCentsFormatter.format(dollars);
  }
  return moneyFormatter.format(dollars);
}

export function formatCompactCurrency(cents: number): string {
  const dollars = cents / 100;
  const abs = Math.abs(dollars);
  const sign = dollars < 0 ? MINUS : "";
  if (abs >= 1_000_000) {
    const value = abs / 1_000_000;
    const digits = value >= 10 ? 0 : 1;
    return `${sign}$${value.toFixed(digits).replace(/\.0$/, "")}M`;
  }
  if (abs >= 1000) {
    return `${sign}$${Math.round(abs / 1000)}k`;
  }
  return formatCurrency(cents);
}

export function formatPercent(ratio: number, digits = 2): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

export function formatRelativeDelta(delta: number): string {
  if (delta === 0) {
    return "0.0%";
  }
  const sign = delta > 0 ? "+" : MINUS;
  return `${sign}${Math.abs(delta).toFixed(1)}%`;
}

export function formatPointsDelta(delta: number): string {
  if (delta === 0) {
    return "0.0 pp";
  }
  const sign = delta > 0 ? "+" : MINUS;
  return `${sign}${Math.abs(delta).toFixed(1)} pp`;
}

export function formatDelta(
  delta: number,
  kind: "relative" | "points",
): string {
  return kind === "points"
    ? formatPointsDelta(delta)
    : formatRelativeDelta(delta);
}

export function formatOrderDate(iso: string): string {
  return orderDateFormatter.format(new Date(iso));
}

export function formatChartTick(
  isoDate: string,
  granularity: "day" | "week" | "month",
): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (granularity === "month") {
    return monthFormatter.format(date);
  }
  return shortDateFormatter.format(date);
}

export function formatRangeLabel(fromIso: string, toIso: string): string {
  const from = new Date(`${fromIso}T00:00:00.000Z`);
  const to = new Date(`${toIso}T00:00:00.000Z`);
  const fromLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(from);
  const toLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(to);
  return `${fromLabel} – ${toLabel}`;
}
