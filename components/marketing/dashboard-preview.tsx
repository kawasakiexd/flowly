import {
  Bell,
  LayoutDashboard,
  Megaphone,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { heroCopy } from "@/content/hero";
import { cn } from "@/lib/utils";

const SIDEBAR_ICONS = [
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Megaphone,
] as const;

function seriesPath(values: readonly number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const line = `M${points.join(" L")}`;
  return {
    area: `${line} L${width},${height} L0,${height} Z`,
    line,
  };
}

export function DashboardPreview() {
  const path = seriesPath(heroCopy.revenueSeries, 320, 96);

  return (
    <div
      role="img"
      aria-label={heroCopy.previewAriaLabel}
      className="relative mx-auto w-full max-w-[1100px]"
    >
      <div className="pointer-events-none absolute inset-x-8 -inset-y-10 rounded-full bg-[radial-gradient(ellipse_at_center,var(--brand-from)/0.22,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="[perspective:2000px]">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-glow motion-safe:lg:origin-center motion-safe:lg:[transform:rotateX(8deg)] motion-safe:lg:transition-transform motion-safe:lg:duration-500 motion-safe:lg:hover:[transform:rotateX(0deg)]">
          <div aria-hidden>
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <p className="ml-2 truncate text-xs font-medium text-muted-foreground">
                {heroCopy.previewTitle}
              </p>
            </div>
            <div className="flex">
              <aside className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-border py-4 lg:flex">
                {SIDEBAR_ICONS.map((Icon, index) => (
                  <div
                    key={Icon.displayName ?? index}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md",
                      index === 0
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                ))}
              </aside>
              <div className="min-w-0 flex-1 p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {heroCopy.kpis.map((kpi, index) => (
                    <div
                      key={kpi.label}
                      className={cn(
                        "rounded-xl bg-muted/60 p-3",
                        index === 2 && "hidden sm:block",
                      )}
                    >
                      <p className="text-xs text-muted-foreground">
                        {kpi.label}
                      </p>
                      <p className="mt-1 text-kpi tabular-nums">{kpi.value}</p>
                      <p className="mt-1 text-xs font-medium text-success">
                        ▲ {kpi.delta}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <div className="rounded-xl bg-muted/40 p-3 lg:col-span-2">
                    <p className="mb-2 text-xs text-muted-foreground">
                      Revenue
                    </p>
                    <svg
                      viewBox="0 0 320 96"
                      className="h-24 w-full"
                      preserveAspectRatio="none"
                    >
                      <path d={path.area} className="fill-chart-1/20" />
                      <path
                        d={path.line}
                        className="fill-none stroke-chart-1"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="hidden space-y-2.5 lg:block">
                    {heroCopy.channels.map((channel) => (
                      <div key={channel.label}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span>{channel.label}</span>
                          <span className="text-muted-foreground tabular-nums">
                            {channel.share}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-chart-1"
                            style={{ width: `${channel.share}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute right-4 bottom-4 hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs shadow-raised sm:flex"
          >
            <Bell className="size-3.5 text-primary" />
            {heroCopy.alert}
          </div>
        </div>
      </div>
    </div>
  );
}
