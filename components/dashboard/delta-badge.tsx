import { TrendingDown, TrendingUp } from "lucide-react";

import { formatDelta } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DeltaBadge({
  delta,
  kind,
}: {
  delta: number | null;
  kind: "relative" | "points";
}) {
  if (delta === null) {
    return (
      <span className="text-xs text-muted-foreground">
        —<span className="sr-only">No comparison data</span>
      </span>
    );
  }

  const up = delta > 0;
  const down = delta < 0;
  const label = formatDelta(delta, kind);
  const sr = up
    ? `Up ${label.replace("+", "")} compared with the previous period`
    : down
      ? `Down ${label.replace("−", "")} compared with the previous period`
      : "No change compared with the previous period";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        up && "bg-success/12 text-success",
        down && "bg-destructive/10 text-destructive",
        !up && !down && "bg-muted text-muted-foreground",
      )}
    >
      {up ? <TrendingUp className="size-3" aria-hidden /> : null}
      {down ? <TrendingDown className="size-3" aria-hidden /> : null}
      {label}
      <span className="sr-only">{sr}</span>
    </span>
  );
}
