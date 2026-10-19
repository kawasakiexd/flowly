import { BrandLogos } from "@/components/marketing/brand-logos";
import { Section } from "@/components/marketing/section";
import { logosCopy } from "@/content/logos";

export function LogoCloud() {
  return (
    <Section className="bg-surface py-12 md:py-16">
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {logosCopy.caption}
      </p>
      <p className="sr-only">{logosCopy.srLabel}</p>
      <div className="hidden justify-center md:flex lg:hidden">
        <BrandLogos className="grid grid-cols-3 gap-x-10 gap-y-6" />
      </div>
      <div className="hidden justify-center lg:flex">
        <BrandLogos className="w-full justify-between" />
      </div>
      <div className="md:hidden">
        <div className="hidden motion-reduce:block">
          <BrandLogos className="grid grid-cols-2 justify-center gap-6" />
        </div>
        <div className="overflow-hidden motion-reduce:hidden">
          <div className="flex w-max animate-marquee gap-10 focus-within:[animation-play-state:paused] hover:[animation-play-state:paused]">
            <BrandLogos />
            <div aria-hidden>
              <BrandLogos />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
