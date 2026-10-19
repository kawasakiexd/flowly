import { Suspense } from "react";
import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { RecentOrders } from "@/components/dashboard/orders/recent-orders";
import { TableSkeleton } from "@/components/dashboard/skeletons";
import { WidgetBoundary } from "@/components/dashboard/widget-boundary";
import { dashboardCopy } from "@/content/dashboard";
import { resolveRange, toOrdersQuery } from "@/lib/data/range";
import { loadDashboardParams } from "@/lib/data/search-params";

export const metadata: Metadata = {
  title: "Orders",
  description: dashboardCopy.ordersPage.description,
  alternates: { canonical: "/dashboard/orders" },
};

export default async function OrdersPage({
  searchParams,
}: PageProps<"/dashboard/orders">) {
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
    size: params.size ?? 20,
  });

  return (
    <>
      <DashboardHeader title={dashboardCopy.ordersPage.title} />
      <div className="mx-auto w-full max-w-[1440px] space-y-4 p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">
          {dashboardCopy.ordersPage.description}
        </p>
        <WidgetBoundary
          title={dashboardCopy.ordersPage.title}
          scenario={scenario}
        >
          <Suspense fallback={<TableSkeleton rows={20} />}>
            <RecentOrders query={query} scenario={scenario} variant="page" />
          </Suspense>
        </WidgetBoundary>
      </div>
    </>
  );
}
