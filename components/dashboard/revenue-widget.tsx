import { Inbox } from "lucide-react";

import { LazyRevenueChart } from "@/components/dashboard/charts/lazy";
import { EmptyState } from "@/components/dashboard/empty-state";
import { WidgetCard } from "@/components/dashboard/widget-card";
import { dashboardCopy } from "@/content/dashboard";
import { getDataSource } from "@/lib/data";
import type { DateRange, DemoScenario } from "@/lib/data/types";
import { formatCurrency, formatRelativeDelta } from "@/lib/format";

export async function RevenueWidget({
  range,
  scenario,
}: {
  range: DateRange;
  scenario: DemoScenario;
}) {
  const series = await getDataSource(scenario).getRevenueSeries(range);
  const delta =
    series.previousTotal && series.previousTotal > 0
      ? ((series.total - series.previousTotal) / series.previousTotal) * 100
      : null;
  const summary = `Revenue this period: ${formatCurrency(series.total)}${
    delta === null
      ? ""
      : `, ${formatRelativeDelta(delta)} from the previous period`
  }.`;

  return (
    <WidgetCard
      title={dashboardCopy.widgets.revenue.title}
      description={dashboardCopy.widgets.revenue.description[range.granularity]}
      summary={summary}
    >
      {series.points.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={dashboardCopy.emptyPeriod}
          description={dashboardCopy.emptyChartText}
        />
      ) : (
        <LazyRevenueChart data={series} granularity={range.granularity} />
      )}
    </WidgetCard>
  );
}
