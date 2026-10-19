import type { Route } from "next";

export type HeaderVariant = "landing" | "page";

export const marketingAnchors = [
  { id: "features", label: "Features" },
  { id: "how-it-works", label: "How it works" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

export function marketingNav(variant: HeaderVariant) {
  return marketingAnchors.map((item) => ({
    href: (variant === "landing" ? `#${item.id}` : `/#${item.id}`) as Route,
    label: item.label,
  }));
}

export function waitlistHref(variant: HeaderVariant): Route {
  return (variant === "landing" ? "#waitlist" : "/#waitlist") as Route;
}

export const demoHref = "/dashboard" as const;

export const headerCtas = {
  demo: { href: demoHref, label: "Live demo" },
  waitlist: { label: "Join waitlist" },
} as const;
