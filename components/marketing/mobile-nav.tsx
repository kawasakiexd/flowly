"use client";

import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { headerCtas } from "@/content/navigation";

export function MobileNav({
  links,
  waitlistHref,
}: {
  links: { href: Route; label: string }[];
  waitlistHref: Route;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(20rem,85vw)] sm:max-w-[min(20rem,85vw)]"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-12 items-center text-base font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2 flex flex-col gap-3 border-t px-2 pt-4">
          <Button variant="outline" className="h-11 w-full" asChild>
            <Link href={headerCtas.demo.href} onClick={() => setOpen(false)}>
              {headerCtas.demo.label}
            </Link>
          </Button>
          <Button className="h-11 w-full" asChild>
            <Link href={waitlistHref} onClick={() => setOpen(false)}>
              {headerCtas.waitlist.label}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
