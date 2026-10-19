export const footerCopy = {
  oneLiner: "Revenue analytics for independent online stores.",
  githubAriaLabel: "View source on GitHub",
  columns: {
    product: {
      title: "Product",
      links: [
        { href: "/#features", label: "Features" },
        { href: "/#how-it-works", label: "How it works" },
        { href: "/#pricing", label: "Pricing" },
        { href: "/#faq", label: "FAQ" },
        { href: "/dashboard", label: "Live demo" },
      ],
    },
    legal: {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy policy" },
        { href: "/terms", label: "Terms of service" },
      ],
    },
    about: {
      title: "About this project",
      links: [
        { href: "github", label: "Source code" },
        { href: "author", label: "Built by Arseniy" },
      ],
    },
  },
  disclaimer:
    "A fictional product — all names, companies and figures are made up.",
  builtWith: "Built with Next.js, Tailwind CSS and shadcn/ui.",
} as const;
