import Link from "next/link";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Button } from "@/components/ui/button";
import { legalCopy } from "@/content/legal";

export default function NotFound() {
  return (
    <>
      <SiteHeader variant="page" />
      <main id="main" className="container-page section-y text-center">
        <h1 className="text-h2">{legalCopy.notFound.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          {legalCopy.notFound.text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button className="h-11 px-5" asChild>
            <Link href="/">{legalCopy.notFound.home}</Link>
          </Button>
          <Button variant="outline" className="h-11 px-5" asChild>
            <Link href="/dashboard">{legalCopy.notFound.demo}</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
