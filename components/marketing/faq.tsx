import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/marketing/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCopy } from "@/content/faq";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Reveal>
            <SectionHeader
              eyebrow={faqCopy.eyebrow}
              title={faqCopy.title}
              titleId="faq-heading"
              align="left"
              lead={
                <>
                  {faqCopy.leadBefore}
                  <Link
                    href="/dashboard"
                    className="text-foreground underline underline-offset-3"
                  >
                    {faqCopy.leadLink}
                  </Link>
                  {faqCopy.leadAfter}
                </>
              }
            />
          </Reveal>
        </div>
        <div className="mx-auto w-full max-w-[48rem] lg:col-span-8 lg:mx-0">
          <Accordion type="multiple">
            {faqCopy.items.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="py-4 text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {"answer" in item ? (
                    item.answer
                  ) : (
                    <>
                      {item.answerBefore}
                      <Link
                        href="/dashboard"
                        className="text-foreground underline underline-offset-3"
                      >
                        {item.answerLink}
                      </Link>
                      {item.answerAfter}
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}
