import * as z from "zod";

import { ORDER_STATUSES, TRAFFIC_SOURCES } from "@/lib/data/types";

export const SHOPCORE_ENDPOINTS = {
  getKpis: "/v1/analytics/kpis",
  getRevenueSeries: "/v1/analytics/revenue",
  getOrdersSeries: "/v1/analytics/orders-volume",
  getTrafficSources: "/v1/analytics/traffic-sources",
  getOrders: "/v1/orders",
} as const;

export const kpiDto = z.object({
  id: z.enum(["revenue", "orders", "aov", "conversion"]),
  value: z.number().nullable(),
  previous: z.number().nullable(),
  delta: z.number().nullable(),
  deltaKind: z.enum(["relative", "points"]),
  sparkline: z.array(z.number()),
});

export const timeSeriesDto = z.object({
  granularity: z.enum(["day", "week", "month"]),
  points: z.array(
    z.object({
      bucket: z.string(),
      value: z.number(),
      previous: z.number().nullable(),
    }),
  ),
  total: z.number(),
  previousTotal: z.number().nullable(),
});

export const trafficSliceDto = z.object({
  source: z.enum(TRAFFIC_SOURCES),
  sessions: z.number(),
  share: z.number(),
});

export const orderDto = z.object({
  id: z.string(),
  number: z.string(),
  createdAt: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string(),
  }),
  source: z.enum(TRAFFIC_SOURCES),
  status: z.enum(ORDER_STATUSES),
  items: z.number(),
  totalCents: z.number(),
  currency: z.literal("USD"),
});

export const ordersPageDto = z.object({
  rows: z.array(orderDto),
  total: z.number(),
  totalInRange: z.number(),
  page: z.number(),
  pageSize: z.number(),
  pageCount: z.number(),
});
