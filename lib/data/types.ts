export const RANGE_PRESETS = ["7d", "30d", "90d", "12m"] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];
export type Granularity = "day" | "week" | "month";

export interface DateRange {
  preset: RangePreset | "custom";
  from: string;
  to: string;
  days: number;
  granularity: Granularity;
}

export const ORDER_STATUSES = [
  "paid",
  "fulfilled",
  "pending",
  "refunded",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const TRAFFIC_SOURCES = [
  "organic",
  "paid",
  "social",
  "email",
  "direct",
] as const;
export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];

export type KpiId = "revenue" | "orders" | "aov" | "conversion";
export interface Kpi {
  id: KpiId;
  value: number | null;
  previous: number | null;
  delta: number | null;
  deltaKind: "relative" | "points";
  sparkline: number[];
}

export interface SeriesPoint {
  bucket: string;
  value: number;
  previous: number | null;
}

export interface TimeSeries {
  granularity: Granularity;
  points: SeriesPoint[];
  total: number;
  previousTotal: number | null;
}

export interface TrafficSlice {
  source: TrafficSource;
  sessions: number;
  share: number;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  customer: { name: string; email: string };
  source: TrafficSource;
  status: OrderStatus;
  items: number;
  totalCents: number;
  currency: "USD";
}

export const ORDER_SORT_FIELDS = ["createdAt", "customer", "total"] as const;
export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number];
export type SortDirection = "asc" | "desc";

export interface OrdersQuery {
  range: DateRange;
  q: string;
  status: OrderStatus[];
  source: TrafficSource[];
  sort: { field: OrderSortField; direction: SortDirection };
  page: number;
  pageSize: 10 | 20 | 50;
}

export interface OrdersPage {
  rows: Order[];
  total: number;
  totalInRange: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export const DEMO_SCENARIOS = ["normal", "slow", "empty", "error"] as const;
export type DemoScenario = (typeof DEMO_SCENARIOS)[number];
