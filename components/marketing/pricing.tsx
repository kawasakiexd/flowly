import { Reveal } from "@/components/motion/reveal";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Section, SectionHeader } from "@/components/marketing/section";
import { pricingCopy } from "@/content/pricing";

export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-heading">
      <Reveal>
        <SectionHeader
          eyebrow={pricingCopy.eyebrow}
          title={pricingCopy.title}
          titleId="pricing-heading"
          lead={pricingCopy.lead}
        />
      </Reveal>
      <PricingPlans plans={[...pricingCopy.plans]} />
    </Section>
  );
}
