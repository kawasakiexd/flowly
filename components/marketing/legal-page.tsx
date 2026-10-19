import { legalCopy } from "@/content/legal";

export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: readonly { heading: string; body: string }[];
}) {
  return (
    <article className="container-page max-w-[44rem] section-y">
      <h1 className="text-h2 text-balance">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{legalCopy.updated}</p>
      <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-sm">
        {legalCopy.notice}
      </div>
      <div className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className="text-h3">
              {index + 1}. {section.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
