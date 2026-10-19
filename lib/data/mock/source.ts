import {
  kpisForRange,
  ordersForQuery,
  ordersSeriesForRange,
  revenueSeriesForRange,
  trafficForRange,
} from "@/lib/data/mock/generate";
import type { DashboardDataSource } from "@/lib/data/source";

function wait(ms: number) {
  return ms > 0
    ? new Promise((resolve) => setTimeout(resolve, ms))
    : Promise.resolve();
}

export function createMockDataSource(options?: {
  latencyMs?: number;
}): DashboardDataSource {
  const latencyMs = options?.latencyMs ?? 0;

  return {
    async getKpis(range) {
      await wait(latencyMs);
      return kpisForRange(range);
    },
    async getRevenueSeries(range) {
      await wait(latencyMs);
      return revenueSeriesForRange(range);
    },
    async getOrdersSeries(range) {
      await wait(latencyMs);
      return ordersSeriesForRange(range);
    },
    async getTrafficSources(range) {
      await wait(latencyMs);
      return trafficForRange(range);
    },
    async getOrders(query) {
      await wait(latencyMs);
      return ordersForQuery(query);
    },
  };
}
