import { cn } from "@/lib/utils";

export function WidgetCard({
  title,
  description,
  action,
  summary,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  summary?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-card sm:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {summary ? <p className="sr-only">{summary}</p> : null}
      {children}
    </section>
  );
}
