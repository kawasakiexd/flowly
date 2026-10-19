import { SimulatedError } from "@/lib/errors";
import type { DashboardDataSource } from "@/lib/data/source";
import type {
  DemoScenario,
  Kpi,
  OrdersPage,
  TimeSeries,
} from "@/lib/data/types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const EMPTY_KPI: Kpi[] = (
  ["revenue", "orders", "aov", "conversion"] as const
).map((id) => ({
  id,
  value: null,
  previous: null,
  delta: null,
  deltaKind: id === "conversion" ? "points" : "relative",
  sparkline: [],
}));

const EMPTY_SERIES: TimeSeries = {
  granularity: "day",
  points: [],
  total: 0,
  previousTotal: null,
};

const EMPTY_ORDERS: OrdersPage = {
  rows: [],
  total: 0,
  totalInRange: 0,
  page: 1,
  pageSize: 10,
  pageCount: 1,
};

export function withScenario(
  source: DashboardDataSource,
  scenario: DemoScenario,
): DashboardDataSource {
  if (scenario === "normal") {
    return source;
  }

  if (scenario === "slow") {
    return {
      async getKpis(range) {
        await wait(600);
        return source.getKpis(range);
      },
      async getRevenueSeries(range) {
        await wait(1200);
        return source.getRevenueSeries(range);
      },
      async getOrdersSeries(range) {
        await wait(1200);
        return source.getOrdersSeries(range);
      },
      async getTrafficSources(range) {
        await wait(1200);
        return source.getTrafficSources(range);
      },
      async getOrders(query) {
        await wait(1800);
        return source.getOrders(query);
      },
    };
  }

  if (scenario === "empty") {
    return {
      async getKpis() {
        return EMPTY_KPI;
      },
      async getRevenueSeries() {
        return EMPTY_SERIES;
      },
      async getOrdersSeries() {
        return EMPTY_SERIES;
      },
      async getTrafficSources() {
        return [];
      },
      async getOrders() {
        return EMPTY_ORDERS;
      },
    };
  }

  return {
    getKpis: source.getKpis.bind(source),
    getOrdersSeries: source.getOrdersSeries.bind(source),
    getOrders: source.getOrders.bind(source),
    async getRevenueSeries() {
      throw new SimulatedError("Simulated analytics API failure");
    },
    async getTrafficSources() {
      throw new SimulatedError("Simulated analytics API failure");
    },
  };
}
