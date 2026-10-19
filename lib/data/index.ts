import "server-only";

import { getDataSourceConfig } from "@/lib/env";
import { createMockDataSource } from "@/lib/data/mock/source";
import { withScenario } from "@/lib/data/scenario";
import { createShopCoreDataSource } from "@/lib/data/shopcore/source";
import type { DashboardDataSource } from "@/lib/data/source";
import type { DemoScenario } from "@/lib/data/types";

export function getDataSource(
  scenario: DemoScenario = "normal",
): DashboardDataSource {
  const config = getDataSourceConfig();
  const source =
    config.kind === "mock"
      ? createMockDataSource({ latencyMs: config.latencyMs })
      : createShopCoreDataSource({
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
        });

  return withScenario(source, scenario);
}
