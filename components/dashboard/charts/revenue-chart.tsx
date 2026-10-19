"use client";

import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Granularity, TimeSeries } from "@/lib/data/types";
import {
  formatChartTick,
  formatCompactCurrency,
  formatCurrency,
} from "@/lib/format";

const config = {
  value: { label: "This period", color: "var(--chart-1)" },
  previous: { label: "Previous period", color: "var(--muted-foreground)" },
};

export function RevenueChart({
  data,
  granularity,
}: {
  data: TimeSeries;
  granularity: Granularity;
}) {
  const rows = data.points.map((point) => ({
    bucket: point.bucket,
    label: formatChartTick(point.bucket, granularity),
    value: point.value,
    previous: point.previous,
  }));

  return (
    <ChartContainer
      config={config}
      className="aspect-auto h-[260px] w-full sm:h-[300px]"
    >
      <AreaChart data={rows} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <span>
                  {name}: {formatCurrency(Number(value ?? 0))}
                </span>
              )}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.15}
        />
        <Line
          type="monotone"
          dataKey="previous"
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
