"use client";

import { useSyncExternalStore } from "react";
import type { Route } from "next";
import Link from "next/link";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dashboardCopy } from "@/content/dashboard";

const STORAGE_KEY = "flowly-demo-banner";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return sessionStorage.getItem(STORAGE_KEY) === "hidden";
}

function getServerSnapshot() {
  return false;
}

export function DemoBanner() {
  const hidden = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (hidden) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/8 px-4 py-2 text-sm text-foreground sm:px-6">
      <p>
        {dashboardCopy.banner}{" "}
        <Link
          href={"/" as Route}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {dashboardCopy.backToSite}
        </Link>
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-11 shrink-0 sm:size-8"
        aria-label={dashboardCopy.dismissBanner}
        onClick={() => {
          sessionStorage.setItem(STORAGE_KEY, "hidden");
          window.dispatchEvent(new Event("storage"));
        }}
      >
        <X />
      </Button>
    </div>
  );
}
