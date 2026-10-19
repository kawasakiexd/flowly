import type { Route } from "next";
import Link from "next/link";

import { GitHubIcon } from "@/components/shared/brand-icons";
import { Logo } from "@/components/shared/logo";
import { footerCopy } from "@/content/footer";
import { siteConfig } from "@/lib/site";

const year = new Date().getFullYear();

export function SiteFooter() {
  const aboutLinks = [
    {
      href: siteConfig.links.github,
      label: footerCopy.columns.about.links[0].label,
      external: true,
    },
    {
      href: siteConfig.author.url,
      label: footerCopy.columns.about.links[1].label,
      external: true,
    },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:gap-12">
          <div className="md:w-2/5">
            <Logo gradientId="flowly-footer" />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {footerCopy.oneLiner}
            </p>
            <a
              href={siteConfig.links.github}
              className="mt-4 inline-flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label={footerCopy.githubAriaLabel}
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon className="size-5" />
            </a>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title={footerCopy.columns.product.title}
              links={footerCopy.columns.product.links}
            />
            <FooterColumn
              title={footerCopy.columns.legal.title}
              links={footerCopy.columns.legal.links}
            />
            <div>
              <p className="text-sm font-semibold">
                {footerCopy.columns.about.title}
              </p>
              <ul className="mt-3 space-y-2">
                {aboutLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Flowly. {footerCopy.disclaimer}
          </p>
          <p>{footerCopy.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: Route; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
