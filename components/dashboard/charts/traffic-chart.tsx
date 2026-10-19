"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { dashboardCopy } from "@/content/dashboard";
import type { TrafficSlice } from "@/lib/data/types";
import { formatInteger, formatPercent } from "@/lib/format";

const COLORS: Record<string, string> = {
  organic: "var(--chart-1)",
  paid: "var(--chart-2)",
  social: "var(--chart-5)",
  email: "var(--chart-4)",
  direct: "var(--chart-3)",
};

export function TrafficChart({ data }: { data: TrafficSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.sessions, 0);
  const config = Object.fromEntries(
    data.map((slice) => [
      slice.source,
      {
        label: dashboardCopy.trafficLabels[slice.source],
        color: COLORS[slice.source],
      },
    ]),
  );

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
      <div className="relative mx-auto h-[220px] w-full max-w-[220px]">
        <ChartContainer
          config={config}
          className="aspect-auto h-[220px] w-full"
        >
          <PieChart accessibilityLayer>
            <Pie
              data={data}
              dataKey="sessions"
              nameKey="source"
              innerRadius={58}
              outerRadius={88}
            >
              {data.map((slice) => (
                <Cell key={slice.source} fill={COLORS[slice.source]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold tabular-nums">
            {formatCompactSessions(total)}
          </span>
          <span className="text-xs text-muted-foreground">sessions</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((slice) => (
          <li
            key={slice.source}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: COLORS[slice.source] }}
                aria-hidden
              />
              {dashboardCopy.trafficLabels[slice.source]}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {formatInteger(slice.sessions)} · {formatPercent(slice.share, 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatCompactSessions(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(value);
}
