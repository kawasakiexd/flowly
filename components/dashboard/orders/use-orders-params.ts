"use client";

import { useTransition } from "react";
import { debounce, useQueryStates } from "nuqs";

import { dashboardParsers } from "@/lib/data/search-params";

const sharedOptions = {
  shallow: false as const,
  history: "replace" as const,
};

export function useOrdersParams() {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(dashboardParsers, {
    ...sharedOptions,
    startTransition,
  });

  return { params, setParams, isPending, startTransition };
}

export function useDebouncedSearchParams() {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(
    {
      ...dashboardParsers,
      q: dashboardParsers.q.withOptions({
        limitUrlUpdates: debounce(300),
      }),
    },
    {
      ...sharedOptions,
      startTransition,
    },
  );

  return { params, setParams, isPending };
}
