import { KpiCard } from "@/components/dashboard/kpi-card";
import { comparisonLabel } from "@/lib/data/range";
import { getDataSource } from "@/lib/data";
import type { DateRange, DemoScenario } from "@/lib/data/types";

export async function KpiGrid({
  range,
  scenario,
}: {
  range: DateRange;
  scenario: DemoScenario;
}) {
  const kpis = await getDataSource(scenario).getKpis(range);
  const caption = comparisonLabel(range);

  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} comparisonLabel={caption} />
      ))}
    </div>
  );
}
