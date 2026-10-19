import { Inbox } from "lucide-react";

import { LazyTrafficChart } from "@/components/dashboard/charts/lazy";
import { EmptyState } from "@/components/dashboard/empty-state";
import { WidgetCard } from "@/components/dashboard/widget-card";
import { dashboardCopy } from "@/content/dashboard";
import { getDataSource } from "@/lib/data";
import type { DateRange, DemoScenario } from "@/lib/data/types";
import { formatInteger } from "@/lib/format";

export async function TrafficWidget({
  range,
  scenario,
}: {
  range: DateRange;
  scenario: DemoScenario;
}) {
  const slices = await getDataSource(scenario).getTrafficSources(range);
  const total = slices.reduce((sum, slice) => sum + slice.sessions, 0);

  return (
    <WidgetCard
      title={dashboardCopy.widgets.traffic.title}
      description={dashboardCopy.widgets.traffic.description}
      summary={`${formatInteger(total)} sessions.`}
    >
      {slices.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={dashboardCopy.emptyPeriod}
          description={dashboardCopy.emptyChartText}
        />
      ) : (
        <LazyTrafficChart data={slices} />
      )}
    </WidgetCard>
  );
}
