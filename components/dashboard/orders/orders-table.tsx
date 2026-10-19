"use client";

import { useTable } from "@tanstack/react-table";
import { Inbox } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ordersColumns } from "@/components/dashboard/orders/columns";
import { OrdersPagination } from "@/components/dashboard/orders/orders-pagination";
import { OrdersToolbar } from "@/components/dashboard/orders/orders-toolbar";
import { ordersTableFeatures } from "@/components/dashboard/orders/table-features";
import { useOrdersParams } from "@/components/dashboard/orders/use-orders-params";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dashboardCopy } from "@/content/dashboard";
import { parseSort } from "@/lib/data/range";
import type { OrdersPage } from "@/lib/data/types";
import { SORT_VALUES } from "@/lib/data/search-params";
import { cn } from "@/lib/utils";

const COLUMN_CLASS: Record<string, string> = {
  number: "sticky left-0 z-10 bg-card",
  source: "hidden md:table-cell",
  items: "hidden lg:table-cell",
};

const emptyRows: OrdersPage["rows"] = [];

export function OrdersTable({
  page,
  variant,
}: {
  page: OrdersPage;
  variant: "card" | "page";
}) {
  const { params, setParams, isPending } = useOrdersParams();
  const sort = parseSort(params.sort);

  const table = useTable({
    features: ordersTableFeatures,
    columns: ordersColumns,
    data: page.rows.length > 0 ? page.rows : emptyRows,
    getRowId: (row) => row.id,
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    rowCount: page.total,
    pageCount: page.pageCount,
    state: {
      sorting: [{ id: sort.field, desc: sort.direction === "desc" }],
      pagination: {
        pageIndex: page.page - 1,
        pageSize: page.pageSize,
      },
    },
    onSortingChange: (updater) => {
      const current = [{ id: sort.field, desc: sort.direction === "desc" }];
      const next = typeof updater === "function" ? updater(current) : updater;
      const first = next[0];
      if (!first) {
        return;
      }
      const value = `${first.id}.${first.desc ? "desc" : "asc"}`;
      const safe = SORT_VALUES.includes(value as (typeof SORT_VALUES)[number])
        ? (value as (typeof SORT_VALUES)[number])
        : "createdAt.desc";
      void setParams({ sort: safe, page: null });
    },
  });

  const isFiltered =
    Boolean(params.q) || params.status.length > 0 || params.source.length > 0;
  const empty = page.total === 0;

  return (
    <div className="space-y-4">
      <OrdersToolbar table={table} isPending={isPending} />
      {empty ? (
        <EmptyState
          icon={Inbox}
          title={
            isFiltered
              ? dashboardCopy.table.emptyFiltersTitle
              : dashboardCopy.table.emptyPeriodTitle
          }
          description={
            isFiltered
              ? dashboardCopy.table.emptyFiltersText
              : dashboardCopy.table.emptyPeriodText
          }
          action={
            isFiltered ? (
              <Button
                variant="outline"
                onClick={() =>
                  void setParams({ q: "", status: [], source: [], page: null })
                }
              >
                {dashboardCopy.table.clearFilters}
              </Button>
            ) : null
          }
        />
      ) : (
        <div
          className={cn(
            "transition-opacity",
            isPending && "opacity-60",
            variant === "page" &&
              "overflow-hidden rounded-xl border border-border",
          )}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    return (
                      <TableHead
                        key={header.id}
                        className={COLUMN_CLASS[header.column.id]}
                        aria-sort={
                          sorted === "asc"
                            ? "ascending"
                            : sorted === "desc"
                              ? "descending"
                              : canSort
                                ? "none"
                                : undefined
                        }
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            className="inline-flex items-center"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <table.FlexRender header={header} />
                          </button>
                        ) : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={COLUMN_CLASS[cell.column.id]}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {!empty ? <OrdersPagination page={page} /> : null}
    </div>
  );
}
