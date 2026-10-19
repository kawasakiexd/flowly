"use client";

import { FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardCopy } from "@/content/dashboard";
import { DEMO_SCENARIOS, type DemoScenario } from "@/lib/data/types";

import { useOrdersParams } from "./orders/use-orders-params";

export function ScenarioMenu() {
  const { params, setParams } = useOrdersParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-11 gap-2 px-3 sm:h-8"
          aria-label={dashboardCopy.demoMenu.triggerAria}
        >
          <FlaskConical className="size-4" aria-hidden />
          <span className="hidden sm:inline">
            {dashboardCopy.demoMenu.trigger}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel>{dashboardCopy.demoMenu.label}</DropdownMenuLabel>
        <p className="px-1.5 pb-1.5 text-xs text-muted-foreground">
          {dashboardCopy.demoMenu.helper}
        </p>
        <DropdownMenuRadioGroup
          value={params.demo}
          onValueChange={(value) => {
            void setParams({ demo: value as DemoScenario, page: null });
          }}
        >
          {DEMO_SCENARIOS.map((scenario) => (
            <DropdownMenuRadioItem key={scenario} value={scenario}>
              {dashboardCopy.demoMenu.items[scenario]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
