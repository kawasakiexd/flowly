import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  const paths = ["", "/dashboard", "/dashboard/orders", "/privacy", "/terms"];

  return paths.map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified,
  }));
}
