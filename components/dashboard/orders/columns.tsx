"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/orders/status-badge";
import { ordersColumnHelper } from "@/components/dashboard/orders/table-features";
import { dashboardCopy } from "@/content/dashboard";
import type { Order } from "@/lib/data/types";
import { formatCurrency, formatInteger, formatOrderDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const SOURCE_DOT: Record<Order["source"], string> = {
  organic: "bg-chart-1",
  paid: "bg-chart-2",
  social: "bg-chart-5",
  email: "bg-chart-4",
  direct: "bg-chart-3",
};

function SortableHeader({
  label,
  sorted,
}: {
  label: string;
  sorted: false | "asc" | "desc";
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      {sorted === "asc" ? <ArrowUp className="size-3.5" aria-hidden /> : null}
      {sorted === "desc" ? (
        <ArrowDown className="size-3.5" aria-hidden />
      ) : null}
    </span>
  );
}

export const ordersColumns = ordersColumnHelper.columns([
  ordersColumnHelper.accessor("number", {
    id: "number",
    header: "Order",
    enableSorting: false,
    enableHiding: false,
    cell: ({ getValue }) => (
      <span className="font-mono text-sm">{getValue()}</span>
    ),
  }),
  ordersColumnHelper.accessor("createdAt", {
    id: "createdAt",
    header: ({ column }) => (
      <SortableHeader label="Date" sorted={column.getIsSorted()} />
    ),
    enableHiding: false,
    cell: ({ getValue }) => formatOrderDate(getValue()),
  }),
  ordersColumnHelper.accessor((row) => row.customer.name, {
    id: "customer",
    header: ({ column }) => (
      <SortableHeader label="Customer" sorted={column.getIsSorted()} />
    ),
    enableHiding: false,
    cell: ({ row }) => (
      <div className="min-w-40">
        <div>{row.original.customer.name}</div>
        <div className="hidden text-xs text-muted-foreground md:block">
          {row.original.customer.email}
        </div>
      </div>
    ),
  }),
  ordersColumnHelper.accessor("source", {
    id: "source",
    header: "Source",
    enableSorting: false,
    cell: ({ getValue }) => {
      const source = getValue();
      return (
        <span className="inline-flex items-center gap-2">
          <span
            className={cn("size-2 rounded-full", SOURCE_DOT[source])}
            aria-hidden
          />
          {dashboardCopy.trafficLabels[source]}
        </span>
      );
    },
  }),
  ordersColumnHelper.accessor("status", {
    id: "status",
    header: "Status",
    enableSorting: false,
    enableHiding: false,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
  ordersColumnHelper.accessor("items", {
    id: "items",
    header: () => <span className="block w-full text-right">Items</span>,
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="block text-right tabular-nums">
        {formatInteger(getValue())}
      </span>
    ),
  }),
  ordersColumnHelper.accessor("totalCents", {
    id: "total",
    header: ({ column }) => (
      <span className="flex justify-end">
        <SortableHeader label="Total" sorted={column.getIsSorted()} />
      </span>
    ),
    enableHiding: false,
    cell: ({ row, getValue }) => {
      const struck =
        row.original.status === "refunded" ||
        row.original.status === "cancelled";
      return (
        <span
          className={cn(
            "block text-right tabular-nums",
            struck && "text-muted-foreground line-through",
          )}
        >
          {formatCurrency(getValue())}
        </span>
      );
    },
  }),
]);
