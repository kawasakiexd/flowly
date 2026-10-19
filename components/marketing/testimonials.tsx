import { Quote } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/marketing/section";
import { testimonialsCopy } from "@/content/testimonials";

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      labelledBy="testimonials-heading"
      className="bg-surface"
    >
      <Reveal>
        <SectionHeader
          eyebrow={testimonialsCopy.eyebrow}
          title={testimonialsCopy.title}
          titleId="testimonials-heading"
          lead={testimonialsCopy.lead}
        />
      </Reveal>
      <div
        role="region"
        aria-label={testimonialsCopy.regionLabel}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3"
      >
        {testimonialsCopy.items.map((item) => (
          <article
            key={item.name}
            className="w-[85%] shrink-0 snap-start rounded-2xl border border-border bg-card p-6 shadow-card md:w-auto"
          >
            <Quote className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-sm leading-relaxed">{item.quote}</p>
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {item.initials}
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.role} · {item.company}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
