"use client";

import { useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { pricingCopy, type Plan } from "@/content/pricing";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function PricingPlans({ plans }: { plans: Plan[] }) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="mt-10">
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(value) => {
            if (value === "monthly" || value === "yearly") {
              setPeriod(value);
            }
          }}
          aria-label={pricingCopy.toggle.accessibleName}
          className="rounded-full bg-muted p-1"
        >
          <ToggleGroupItem value="monthly" className="h-10 rounded-full px-4">
            {pricingCopy.toggle.monthly}
          </ToggleGroupItem>
          <ToggleGroupItem value="yearly" className="h-10 rounded-full px-4">
            {pricingCopy.toggle.yearly}
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {pricingCopy.toggle.saveBadge}
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <p className="sr-only" aria-live="polite">
        {period === "yearly"
          ? pricingCopy.toggle.liveYearly
          : pricingCopy.toggle.liveMonthly}
      </p>
      <div className="mt-10 grid justify-items-center gap-6 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => {
          const price =
            period === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const note = period === "yearly" ? plan.yearlyNote : plan.monthlyNote;
          return (
            <article
              key={plan.id}
              className={cn(
                "flex w-full max-w-[28rem] flex-col rounded-2xl border border-border bg-card p-6 shadow-card",
                plan.popular &&
                  "shadow-raised ring-2 ring-primary lg:-translate-y-1",
              )}
            >
              {plan.popular ? (
                <p className="mb-3 w-fit rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </p>
              ) : null}
              <h3 className="text-h3">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-6 flex items-end gap-1">
                <span className="relative inline-flex h-10 overflow-hidden text-4xl font-semibold tracking-tight">
                  <AnimatePresence mode="wait">
                    <m.span
                      key={`${plan.id}-${period}`}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={spring}
                      className="inline-block"
                    >
                      ${price}
                    </m.span>
                  </AnimatePresence>
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {period === "yearly"
                    ? pricingCopy.suffix.yearly
                    : pricingCopy.suffix.monthly}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{note}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="mt-8 h-11 w-full"
                asChild
              >
                <a href="#waitlist">{pricingCopy.cta}</a>
              </Button>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        {pricingCopy.footnote}
      </p>
    </div>
  );
}
