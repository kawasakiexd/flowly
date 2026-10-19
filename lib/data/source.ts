import type {
  DateRange,
  Kpi,
  OrdersPage,
  OrdersQuery,
  TimeSeries,
  TrafficSlice,
} from "@/lib/data/types";

export interface DashboardDataSource {
  getKpis(range: DateRange): Promise<Kpi[]>;
  getRevenueSeries(range: DateRange): Promise<TimeSeries>;
  getOrdersSeries(range: DateRange): Promise<TimeSeries>;
  getTrafficSources(range: DateRange): Promise<TrafficSlice[]>;
  getOrders(query: OrdersQuery): Promise<OrdersPage>;
}
