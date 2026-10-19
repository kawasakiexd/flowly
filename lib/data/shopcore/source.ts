import { NotImplementedError } from "@/lib/errors";
import type { DashboardDataSource } from "@/lib/data/source";

export function createShopCoreDataSource(config: {
  baseUrl: string;
  apiKey: string | null;
}): DashboardDataSource {
  void config;
  const notImplemented = async () => {
    throw new NotImplementedError(
      "ShopCore adapter is not implemented yet. Set DASHBOARD_DATA_SOURCE=mock.",
    );
  };

  // Future: async function request<T>(path: string, params: Record<string, string>, schema: z.ZodType<T>) {
  //   const url = new URL(path, config.baseUrl);
  //   for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  //   const response = await fetch(url, {
  //     headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : undefined,
  //     signal: AbortSignal.timeout(5000),
  //     next: { revalidate: 60 },
  //   });
  //   return schema.parse(await response.json());
  // }

  return {
    getKpis: notImplemented,
    getRevenueSeries: notImplemented,
    getOrdersSeries: notImplemented,
    getTrafficSources: notImplemented,
    getOrders: notImplemented,
  };
}
