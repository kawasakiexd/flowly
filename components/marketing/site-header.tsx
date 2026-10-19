import Link from "next/link";

import { HeaderShell } from "@/components/marketing/header-shell";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  headerCtas,
  marketingNav,
  waitlistHref,
  type HeaderVariant,
} from "@/content/navigation";

export function SiteHeader({ variant }: { variant: HeaderVariant }) {
  const links = marketingNav(variant);
  const waitlist = waitlistHref(variant);

  return (
    <HeaderShell>
      <div className="relative container-page flex h-16 items-center justify-between">
        <Logo gradientId="flowly-header" />
        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-11 items-center px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" className="h-11 px-4" asChild>
              <Link href={headerCtas.demo.href}>{headerCtas.demo.label}</Link>
            </Button>
            <Button className="h-11 px-4" asChild>
              <Link href={waitlist}>{headerCtas.waitlist.label}</Link>
            </Button>
          </div>
          <MobileNav links={links} waitlistHref={waitlist} />
        </div>
      </div>
    </HeaderShell>
  );
}
