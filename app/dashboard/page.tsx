import { Suspense } from "react";
import type { Route } from "next";
import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { OrdersVolumeWidget } from "@/components/dashboard/orders-volume-widget";
import { RecentOrders } from "@/components/dashboard/orders/recent-orders";
import { RevenueWidget } from "@/components/dashboard/revenue-widget";
import {
  ChartCardSkeleton,
  KpiGridSkeleton,
  TableSkeleton,
} from "@/components/dashboard/skeletons";
import { TrafficWidget } from "@/components/dashboard/traffic-widget";
import { WidgetBoundary } from "@/components/dashboard/widget-boundary";
import { dashboardCopy } from "@/content/dashboard";
import { resolveRange, toOrdersQuery } from "@/lib/data/range";
import { loadDashboardParams } from "@/lib/data/search-params";

export const metadata: Metadata = {
  title: "Live demo dashboard",
  description:
    "Explore Flowly's revenue analytics dashboard with generated store data: KPIs, charts and a searchable orders table.",
  alternates: { canonical: "/dashboard" },
};

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const params = await loadDashboardParams(searchParams);
  const range = resolveRange(params.range, params.from, params.to);
  const scenario = params.demo;
  const query = toOrdersQuery({
    range,
    q: params.q,
    status: params.status,
    source: params.source,
    sort: params.sort,
    page: params.page,
    size: params.size ?? 10,
  });
  const viewAll = buildOrdersHref(params);

  return (
    <>
      <DashboardHeader title={dashboardCopy.nav.overview} />
      <div className="mx-auto w-full max-w-[1440px] space-y-4 p-4 sm:p-6">
        <WidgetBoundary
          title={dashboardCopy.kpis.revenue.label}
          scenario={scenario}
        >
          <Suspense fallback={<KpiGridSkeleton />}>
            <KpiGrid range={range} scenario={scenario} />
          </Suspense>
        </WidgetBoundary>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <div className="md:col-span-2 lg:col-span-8">
            <WidgetBoundary
              title={dashboardCopy.widgets.revenue.title}
              scenario={scenario}
            >
              <Suspense fallback={<ChartCardSkeleton height={300} />}>
                <RevenueWidget range={range} scenario={scenario} />
              </Suspense>
            </WidgetBoundary>
          </div>
          <div className="lg:col-span-4">
            <WidgetBoundary
              title={dashboardCopy.widgets.traffic.title}
              scenario={scenario}
            >
              <Suspense fallback={<ChartCardSkeleton height={260} />}>
                <TrafficWidget range={range} scenario={scenario} />
              </Suspense>
            </WidgetBoundary>
          </div>
          <div className="lg:col-span-12">
            <WidgetBoundary
              title={dashboardCopy.widgets.orders.title}
              scenario={scenario}
            >
              <Suspense fallback={<ChartCardSkeleton height={220} />}>
                <OrdersVolumeWidget range={range} scenario={scenario} />
              </Suspense>
            </WidgetBoundary>
          </div>
        </div>
        <WidgetBoundary
          title={dashboardCopy.widgets.recent.title}
          scenario={scenario}
        >
          <Suspense fallback={<TableSkeleton />}>
            <RecentOrders
              query={query}
              scenario={scenario}
              variant="card"
              viewAllHref={viewAll}
            />
          </Suspense>
        </WidgetBoundary>
      </div>
    </>
  );
}

function buildOrdersHref(
  params: Awaited<ReturnType<typeof loadDashboardParams>>,
): Route {
  const search = new URLSearchParams();
  if (params.range !== "30d") {
    search.set("range", params.range);
  }
  if (params.range === "custom" && params.from) {
    search.set("from", params.from);
  }
  if (params.range === "custom" && params.to) {
    search.set("to", params.to);
  }
  if (params.q) {
    search.set("q", params.q);
  }
  if (params.status.length) {
    search.set("status", params.status.join(","));
  }
  if (params.source.length) {
    search.set("source", params.source.join(","));
  }
  if (params.sort !== "createdAt.desc") {
    search.set("sort", params.sort);
  }
  if (params.demo !== "normal") {
    search.set("demo", params.demo);
  }
  const qs = search.toString();
  return `/dashboard/orders${qs ? `?${qs}` : ""}` as Route;
}
