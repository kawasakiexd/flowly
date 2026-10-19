"use client";

import type { Route } from "next";
import Link from "next/link";
import type { ErrorInfo } from "next/error";

import { Button } from "@/components/ui/button";
import { dashboardCopy } from "@/content/dashboard";

export default function DashboardError({ retry }: ErrorInfo) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-h3">{dashboardCopy.error.routeTitle}</h2>
      <p className="text-muted-foreground">{dashboardCopy.error.routeText}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={retry}>{dashboardCopy.error.retry}</Button>
        <Button variant="outline" asChild>
          <Link href={"/" as Route}>{dashboardCopy.error.home}</Link>
        </Button>
      </div>
    </div>
  );
}
