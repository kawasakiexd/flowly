"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Granularity, TimeSeries } from "@/lib/data/types";
import { formatChartTick, formatInteger } from "@/lib/format";

const config = {
  value: { label: "Orders", color: "var(--chart-2)" },
};

export function OrdersChart({
  data,
  granularity,
}: {
  data: TimeSeries;
  granularity: Granularity;
}) {
  const rows = data.points.map((point) => ({
    label: formatChartTick(point.bucket, granularity),
    value: point.value,
  }));

  return (
    <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
      <BarChart data={rows} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: number) => formatInteger(value)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
