"use client";

import { m } from "motion/react";

import {
  durations,
  easeOutQuint,
  revealVariants,
  staggerContainer,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={cn(className)}
      variants={revealVariants}
      transition={{ duration: durations.slow, ease: easeOutQuint }}
    >
      {children}
    </m.div>
  );
}
