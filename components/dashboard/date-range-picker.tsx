"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dashboardCopy } from "@/content/dashboard";
import { fromISODate, toISODate } from "@/lib/dates";
import {
  maxSelectableDate,
  minSelectableDate,
  PRESET_SHORT,
  resolveRange,
} from "@/lib/data/range";
import { RANGE_PRESETS, type RangePreset } from "@/lib/data/types";
import { formatRangeLabel } from "@/lib/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { useOrdersParams } from "./orders/use-orders-params";

function utcDate(iso: string) {
  return fromISODate(iso);
}

export function DateRangePicker() {
  const { params, setParams } = useOrdersParams();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const resolved = resolveRange(params.range, params.from, params.to);
  const min = utcDate(minSelectableDate());
  const max = utcDate(maxSelectableDate());
  const [draft, setDraft] = useState<DateRange | undefined>(() => ({
    from: utcDate(resolved.from),
    to: utcDate(resolved.to),
  }));

  const triggerLabel =
    resolved.preset === "custom"
      ? formatRangeLabel(resolved.from, resolved.to)
      : dashboardCopy.presets[resolved.preset];
  const shortLabel =
    resolved.preset === "custom" ? "Custom" : PRESET_SHORT[resolved.preset];

  function applyPreset(preset: RangePreset) {
    void setParams({ range: preset, from: null, to: null, page: null });
    setOpen(false);
  }

  function applyCustom() {
    if (!draft?.from || !draft.to) {
      return;
    }
    const from = toISODate(draft.from);
    const to = toISODate(draft.to);
    void setParams({ range: "custom", from, to, page: null });
    setOpen(false);
  }

  const canApply = Boolean(draft?.from && draft.to);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setDraft({
            from: utcDate(resolved.from),
            to: utcDate(resolved.to),
          });
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-11 min-w-0 justify-start gap-2 px-3 sm:h-8"
        >
          <CalendarDays className="size-4 shrink-0" aria-hidden />
          <span className="sm:hidden">{shortLabel}</span>
          <span className="hidden truncate sm:inline">{triggerLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(100vw-2rem,42rem)] p-3">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="flex flex-col gap-1">
            {RANGE_PRESETS.map((preset) => (
              <Button
                key={preset}
                variant={resolved.preset === preset ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => applyPreset(preset)}
              >
                {dashboardCopy.presets[preset]}
              </Button>
            ))}
            <Button
              variant={resolved.preset === "custom" ? "secondary" : "ghost"}
              className="justify-start"
            >
              {dashboardCopy.presets.custom}
            </Button>
          </div>
          <div>
            <Calendar
              mode="range"
              timeZone="UTC"
              numberOfMonths={isMobile ? 1 : 2}
              selected={draft}
              onSelect={setDraft}
              disabled={{ before: min, after: max }}
              defaultMonth={draft?.from ?? max}
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applyCustom} disabled={!canApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DateRangeCaption({ className }: { className?: string }) {
  return (
    <p
      className={cn("hidden text-xs text-muted-foreground lg:block", className)}
    >
      {dashboardCopy.utcCaption}
    </p>
  );
}
