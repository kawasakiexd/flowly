"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

export const LazyRevenueChart = dynamic(
  () => import("./revenue-chart").then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> },
);

export const LazyOrdersChart = dynamic(
  () => import("./orders-chart").then((mod) => mod.OrdersChart),
  { ssr: false, loading: () => <Skeleton className="h-[220px] w-full" /> },
);

export const LazyTrafficChart = dynamic(
  () => import("./traffic-chart").then((mod) => mod.TrafficChart),
  { ssr: false, loading: () => <Skeleton className="h-[260px] w-full" /> },
);
