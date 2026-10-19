"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function HeaderShell({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        className="pointer-events-none h-2 w-full"
        aria-hidden
      />
      <header
        data-scrolled={scrolled ? "true" : "false"}
        className={cn(
          "sticky top-0 z-50 -mt-2 h-16 w-full border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-200",
          "data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/80 data-[scrolled=true]:backdrop-blur-md",
        )}
      >
        {children}
      </header>
    </>
  );
}
