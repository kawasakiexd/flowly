import { cn } from "@/lib/utils";

export function Section({
  id,
  labelledBy,
  className,
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("section-y", className)}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  align = "center",
  leadExtra,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  lead?: React.ReactNode;
  align?: "center" | "left";
  leadExtra?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        "max-w-[40rem]",
      )}
    >
      <p className="text-eyebrow text-primary uppercase">{eyebrow}</p>
      <h2 id={titleId} className="mt-3 text-h2 text-balance">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-lead text-pretty text-muted-foreground">
          {lead}
          {leadExtra}
        </p>
      ) : null}
    </div>
  );
}
