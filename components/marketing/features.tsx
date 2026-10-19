import { Bell, ChartLine, Mail, Search, Target, Workflow } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section, SectionHeader } from "@/components/marketing/section";
import { featuresCopy } from "@/content/features";

const ICONS = {
  ChartLine,
  Workflow,
  Bell,
  Search,
  Target,
  Mail,
} as const;

export function Features() {
  return (
    <Section id="features" labelledBy="features-heading">
      <Reveal>
        <SectionHeader
          eyebrow={featuresCopy.eyebrow}
          title={featuresCopy.title}
          titleId="features-heading"
          lead={featuresCopy.lead}
        />
      </Reveal>
      <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuresCopy.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <StaggerItem key={item.title}>
              <article className="rounded-2xl border border-border bg-card p-6 shadow-card transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/30 motion-reduce:hover:translate-y-0">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-h3">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
