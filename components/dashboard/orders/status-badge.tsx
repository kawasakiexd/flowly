import { Badge } from "@/components/ui/badge";
import { dashboardCopy } from "@/content/dashboard";
import type { OrderStatus } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<OrderStatus, string> = {
  paid: "border-transparent bg-primary/10 text-primary",
  fulfilled: "border-transparent bg-success/12 text-success",
  pending: "border-transparent bg-warning text-warning-foreground",
  refunded: "border-transparent bg-muted text-muted-foreground",
  cancelled: "border-transparent bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={cn("font-medium", STATUS_CLASS[status])}>
      {dashboardCopy.status[status]}
    </Badge>
  );
}
