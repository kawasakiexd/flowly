export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) {
    return explicit;
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    "",
  );
  if (vercelHost) {
    return `https://${vercelHost}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Flowly",
  tagline: "Know where every dollar in your store flows.",
  oneLiner: "Revenue analytics for independent online stores.",
  description:
    "Flowly turns orders, refunds and traffic into one live revenue dashboard for independent online stores. Join the private beta waitlist.",
  ogAlt: "Flowly — revenue analytics for independent online stores",
  author: {
    name: "Arseniy",
    url: "https://github.com/arseniy",
  },
  links: {
    github: "https://github.com/arseniy/flowly",
  },
} as const;
