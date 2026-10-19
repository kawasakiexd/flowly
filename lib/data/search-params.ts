import {
  createLoader,
  parseAsArrayOf,
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import {
  DEMO_SCENARIOS,
  ORDER_STATUSES,
  RANGE_PRESETS,
  TRAFFIC_SOURCES,
} from "@/lib/data/types";

export const SORT_VALUES = [
  "createdAt.desc",
  "createdAt.asc",
  "customer.asc",
  "customer.desc",
  "total.desc",
  "total.asc",
] as const;

export const dashboardParsers = {
  range: parseAsStringLiteral([...RANGE_PRESETS, "custom"]).withDefault("30d"),
  from: parseAsString,
  to: parseAsString,
  q: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringLiteral(ORDER_STATUSES)).withDefault([]),
  source: parseAsArrayOf(parseAsStringLiteral(TRAFFIC_SOURCES)).withDefault([]),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault("createdAt.desc"),
  page: parseAsInteger.withDefault(1),
  size: parseAsNumberLiteral([10, 20, 50]),
  demo: parseAsStringLiteral(DEMO_SCENARIOS).withDefault("normal"),
};

export const loadDashboardParams = createLoader(dashboardParsers);
