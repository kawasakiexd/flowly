import type { Metadata } from "next";

import { LegalPage } from "@/components/marketing/legal-page";
import { legalCopy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: legalCopy.notice,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={legalCopy.privacy.title}
      sections={legalCopy.privacy.sections}
    />
  );
}
