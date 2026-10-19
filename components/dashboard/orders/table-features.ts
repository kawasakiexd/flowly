import {
  columnVisibilityFeature,
  createColumnHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

import type { Order } from "@/lib/data/types";

export const ordersTableFeatures = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
});

export const ordersColumnHelper = createColumnHelper<
  typeof ordersTableFeatures,
  Order
>();
