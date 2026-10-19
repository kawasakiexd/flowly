import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/marketing/section";
import { stepsCopy } from "@/content/steps";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      labelledBy="how-it-works-heading"
      className="bg-surface"
    >
      <Reveal>
        <SectionHeader
          eyebrow={stepsCopy.eyebrow}
          title={stepsCopy.title}
          titleId="how-it-works-heading"
          lead={stepsCopy.lead}
        />
      </Reveal>
      <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        <div
          aria-hidden
          className="absolute top-5 right-[16.6%] left-[16.6%] hidden h-px bg-border md:block"
        />
        {stepsCopy.items.map((item) => (
          <li
            key={item.step}
            className="relative flex gap-4 md:flex-col md:items-center md:text-center"
          >
            <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {item.step}
            </div>
            {item.step < stepsCopy.items.length ? (
              <div
                aria-hidden
                className="absolute top-10 left-5 h-[calc(100%-0.5rem)] w-px bg-border md:hidden"
              />
            ) : null}
            <div>
              <h3 className="text-h3">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
              <p className="mt-3 inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {item.pill}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
