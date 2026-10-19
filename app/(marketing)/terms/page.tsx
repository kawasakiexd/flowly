import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { legalCopy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of service",
  description: legalCopy.notice,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={legalCopy.terms.title}
      sections={legalCopy.terms.sections}
    />
  );
}
