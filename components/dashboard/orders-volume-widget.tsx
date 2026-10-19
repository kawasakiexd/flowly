import { Inbox } from "lucide-react";

import { LazyOrdersChart } from "@/components/dashboard/charts/lazy";
import { EmptyState } from "@/components/dashboard/empty-state";
import { WidgetCard } from "@/components/dashboard/widget-card";
import { dashboardCopy } from "@/content/dashboard";
import { getDataSource } from "@/lib/data";
import type { DateRange, DemoScenario } from "@/lib/data/types";

export async function OrdersVolumeWidget({
  range,
  scenario,
}: {
  range: DateRange;
  scenario: DemoScenario;
}) {
  const series = await getDataSource(scenario).getOrdersSeries(range);

  return (
    <WidgetCard
      title={dashboardCopy.widgets.orders.title}
      description={dashboardCopy.widgets.orders.description[range.granularity]}
    >
      {series.points.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={dashboardCopy.emptyPeriod}
          description={dashboardCopy.emptyChartText}
        />
      ) : (
        <LazyOrdersChart data={series} granularity={range.granularity} />
      )}
    </WidgetCard>
  );
}
