import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { Button } from "@/components/ui/button";
import { heroCopy } from "@/content/hero";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-20 md:pb-28">
      <div className="container-page">
        <div className="mx-auto max-w-[48rem] text-center">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm motion-safe:animate-fade-up"
          >
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {heroCopy.badge}
            </span>
            <span className="text-muted-foreground">{heroCopy.badgeLink}</span>
          </a>
          <h1 className="mt-6 text-display text-balance">{heroCopy.h1}</h1>
          <p className="mx-auto mt-5 max-w-[40rem] text-lead text-pretty text-muted-foreground">
            {heroCopy.subheadline}
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 [animation-delay:80ms] motion-safe:animate-fade-up sm:max-w-none sm:flex-row sm:justify-center">
            <Button className="h-12 px-5" asChild>
              <a href="#waitlist">{heroCopy.primaryCta}</a>
            </Button>
            <Button variant="outline" className="h-12 px-5" asChild>
              <Link href="/dashboard">
                {heroCopy.secondaryCta}
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {heroCopy.microcopy}
          </p>
        </div>
        <div className="mt-12 [animation-delay:160ms] motion-safe:animate-fade-up sm:mt-16">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
