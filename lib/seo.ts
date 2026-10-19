import type { Graph } from "schema-dts";

import { getSiteUrl, siteConfig } from "@/lib/site";

export function buildLandingJsonLd(): Graph {
  const url = getSiteUrl();
  const organizationId = `${url}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url,
        logo: `${url}/icon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: siteConfig.name,
        url,
        publisher: { "@id": organizationId },
      },
      {
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        url,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: 0,
          highPrice: 79,
          priceCurrency: "USD",
          offerCount: 3,
        },
      },
    ],
  };
}
