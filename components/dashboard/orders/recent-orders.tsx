import type { Route } from "next";
import Link from "next/link";

import { OrdersTable } from "@/components/dashboard/orders/orders-table";
import { WidgetCard } from "@/components/dashboard/widget-card";
import { Button } from "@/components/ui/button";
import { dashboardCopy } from "@/content/dashboard";
import { getDataSource } from "@/lib/data";
import type { DemoScenario, OrdersQuery } from "@/lib/data/types";

export async function RecentOrders({
  query,
  scenario,
  variant,
  viewAllHref,
}: {
  query: OrdersQuery;
  scenario: DemoScenario;
  variant: "card" | "page";
  viewAllHref?: Route;
}) {
  const page = await getDataSource(scenario).getOrders(query);
  const table = <OrdersTable page={page} variant={variant} />;

  if (variant === "page") {
    return table;
  }

  return (
    <WidgetCard
      title={dashboardCopy.widgets.recent.title}
      description={dashboardCopy.widgets.recent.description}
      action={
        viewAllHref ? (
          <Button variant="link" className="h-auto px-0" asChild>
            <Link href={viewAllHref}>
              {dashboardCopy.widgets.recent.viewAll}
            </Link>
          </Button>
        ) : null
      }
    >
      {table}
    </WidgetCard>
  );
}
