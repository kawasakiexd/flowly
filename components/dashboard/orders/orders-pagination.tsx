"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dashboardCopy } from "@/content/dashboard";
import type { OrdersPage } from "@/lib/data/types";

import { useOrdersParams } from "./use-orders-params";

export function OrdersPagination({ page }: { page: OrdersPage }) {
  const { setParams } = useOrdersParams();
  const from = page.total === 0 ? 0 : (page.page - 1) * page.pageSize + 1;
  const to = Math.min(page.page * page.pageSize, page.total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {dashboardCopy.table.showing(from, to, page.total)}
      </p>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm">{dashboardCopy.table.rowsPerPage}</span>
          <Select
            value={String(page.pageSize)}
            onValueChange={(value) =>
              void setParams({
                size: Number(value) as 10 | 20 | 50,
                page: null,
              })
            }
          >
            <SelectTrigger
              size="sm"
              aria-label={dashboardCopy.table.rowsPerPage}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">
            {dashboardCopy.table.pageOf(page.page, page.pageCount)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden size-11 sm:inline-flex sm:size-8"
            aria-label={dashboardCopy.table.first}
            disabled={page.page <= 1}
            onClick={() => void setParams({ page: 1 })}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="size-11 sm:size-8"
            aria-label={dashboardCopy.table.previous}
            disabled={page.page <= 1}
            onClick={() => void setParams({ page: Math.max(1, page.page - 1) })}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="size-11 sm:size-8"
            aria-label={dashboardCopy.table.next}
            disabled={page.page >= page.pageCount}
            onClick={() =>
              void setParams({ page: Math.min(page.pageCount, page.page + 1) })
            }
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="hidden size-11 sm:inline-flex sm:size-8"
            aria-label={dashboardCopy.table.last}
            disabled={page.page >= page.pageCount}
            onClick={() => void setParams({ page: page.pageCount })}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
