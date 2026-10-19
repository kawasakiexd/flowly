"use client";

import { catchError, type ErrorInfo } from "next/error";
import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dashboardCopy } from "@/content/dashboard";
import type { DemoScenario } from "@/lib/data/types";

function WidgetErrorFallback(
  { title, scenario }: { title: string; scenario: DemoScenario },
  { retry }: ErrorInfo,
) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
      <TriangleAlert className="size-6 text-destructive" aria-hidden />
      <h3 className="text-sm font-semibold">
        {dashboardCopy.error.title(title)}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {scenario === "error"
          ? dashboardCopy.error.simulated
          : dashboardCopy.error.generic}
      </p>
      <Button variant="outline" onClick={retry}>
        {dashboardCopy.error.retry}
      </Button>
    </div>
  );
}

export const WidgetBoundary = catchError(WidgetErrorFallback);
