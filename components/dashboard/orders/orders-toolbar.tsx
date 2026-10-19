"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { FacetedFilter } from "@/components/dashboard/orders/faceted-filter";
import { useDebouncedSearchParams } from "@/components/dashboard/orders/use-orders-params";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { dashboardCopy } from "@/content/dashboard";
import {
  ORDER_STATUSES,
  TRAFFIC_SOURCES,
  type OrderStatus,
  type TrafficSource,
} from "@/lib/data/types";
import type { ReactTable } from "@tanstack/react-table";
import type { ordersTableFeatures } from "./table-features";
import type { Order } from "@/lib/data/types";

type OrdersTableInstance = ReactTable<typeof ordersTableFeatures, Order>;

const STATUS_OPTIONS = ORDER_STATUSES.map((status) => ({
  value: status,
  label: dashboardCopy.status[status],
}));

const SOURCE_OPTIONS = TRAFFIC_SOURCES.map((source) => ({
  value: source,
  label: dashboardCopy.trafficLabels[source],
}));

export function OrdersToolbar({
  table,
  isPending,
}: {
  table: OrdersTableInstance;
  isPending: boolean;
}) {
  const { params, setParams } = useDebouncedSearchParams();
  const [draft, setDraft] = useState(params.q);
  const hasFilters =
    Boolean(params.q) || params.status.length > 0 || params.source.length > 0;

  function commitSearch(value: string, immediate = false) {
    const next = value.slice(0, 100);
    setDraft(next);
    if (immediate) {
      void setParams({ q: next, page: null }, { limitUrlUpdates: undefined });
    } else {
      void setParams({ q: next, page: null });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full max-w-sm">
        <InputGroupAddon>
          <Search aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          value={draft}
          onChange={(event) => commitSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commitSearch(draft, true);
            }
          }}
          placeholder={dashboardCopy.table.searchPlaceholder}
          aria-label={dashboardCopy.table.searchAria}
        />
        {draft ? (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={dashboardCopy.table.clearSearch}
              onClick={() => commitSearch("", true)}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      <FacetedFilter
        title={dashboardCopy.table.status}
        options={STATUS_OPTIONS}
        selected={params.status}
        onChange={(next) =>
          void setParams({
            status: next as OrderStatus[],
            page: null,
          })
        }
      />
      <FacetedFilter
        title={dashboardCopy.table.source}
        options={SOURCE_OPTIONS}
        selected={params.source}
        onChange={(next) =>
          void setParams({
            source: next as TrafficSource[],
            page: null,
          })
        }
      />
      {hasFilters ? (
        <Button
          variant="ghost"
          className="h-11 sm:h-8"
          onClick={() => {
            setDraft("");
            void setParams(
              { q: "", status: [], source: [], page: null },
              { limitUrlUpdates: undefined },
            );
          }}
        >
          {dashboardCopy.table.reset}
        </Button>
      ) : null}
      <div className="ml-auto hidden items-center gap-2 md:flex">
        {isPending ? <Spinner className="size-4" /> : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8"
              aria-label={dashboardCopy.table.viewAria}
            >
              {dashboardCopy.table.view}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{dashboardCopy.table.view}</DropdownMenuLabel>
            {table.getAllColumns().map((column) => {
              if (!column.getCanHide()) {
                return null;
              }
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isPending ? <Spinner className="size-4 md:hidden" /> : null}
    </div>
  );
}
