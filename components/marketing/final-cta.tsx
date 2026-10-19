import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { finalCtaCopy } from "@/content/final-cta";
import { getTurnstileConfig } from "@/lib/env";

export async function FinalCta() {
  const turnstile = getTurnstileConfig();

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="section-y"
    >
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/12 to-brand-to/10 p-6 sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
          <div className="relative grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <p className="text-eyebrow text-primary uppercase">
                {finalCtaCopy.eyebrow}
              </p>
              <h2 id="waitlist-heading" className="mt-3 text-h2 text-balance">
                {finalCtaCopy.title}
              </h2>
              <p className="mt-4 max-w-[40rem] text-lead text-pretty text-muted-foreground">
                {finalCtaCopy.lead}
              </p>
              <ul className="mt-6 space-y-3">
                {finalCtaCopy.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-success"
                      aria-hidden
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="relative rounded-2xl border border-border bg-card p-5 shadow-raised sm:p-6 lg:col-span-5 lg:col-start-8">
              <WaitlistForm siteKey={turnstile?.siteKey ?? null} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
