import { Info } from "lucide-react";

import { DeltaBadge } from "@/components/dashboard/delta-badge";
import { Sparkline } from "@/components/dashboard/sparkline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { dashboardCopy } from "@/content/dashboard";
import type { Kpi } from "@/lib/data/types";
import { formatCurrency, formatInteger, formatPercent } from "@/lib/format";

export function KpiCard({
  kpi,
  comparisonLabel,
}: {
  kpi: Kpi;
  comparisonLabel: string;
}) {
  const copy = dashboardCopy.kpis[kpi.id];
  const formatted =
    kpi.value === null
      ? "—"
      : kpi.id === "revenue" || kpi.id === "aov"
        ? formatCurrency(kpi.value)
        : kpi.id === "orders"
          ? formatInteger(kpi.value)
          : formatPercent(kpi.value);

  return (
    <article className="flex h-[132px] flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{copy.label}</p>
        <Tooltip>
          <TooltipTrigger
            className="inline-flex size-6 items-center justify-center text-muted-foreground"
            aria-label={copy.tooltip}
          >
            <Info className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{copy.tooltip}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-kpi tabular-nums">{formatted}</p>
          <div className="mt-1 flex items-center gap-2">
            <DeltaBadge delta={kpi.delta} kind={kpi.deltaKind} />
            <span className="text-xs text-muted-foreground">
              {kpi.value === null ? dashboardCopy.emptyPeriod : comparisonLabel}
            </span>
          </div>
        </div>
        {kpi.sparkline.length > 1 ? <Sparkline values={kpi.sparkline} /> : null}
      </div>
    </article>
  );
}
