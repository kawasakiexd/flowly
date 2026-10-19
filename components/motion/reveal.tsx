"use client";

import { m } from "motion/react";

import { durations, easeOutQuint, revealVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={revealVariants}
      transition={{ duration: durations.slow, ease: easeOutQuint, delay }}
    >
      {children}
    </m.div>
  );
}
