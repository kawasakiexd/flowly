import { TableSkeleton } from "@/components/dashboard/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div>
      <div className="flex h-14 items-center gap-3 border-b border-border px-4 sm:px-6">
        <Skeleton className="size-8" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mx-auto w-full max-w-[1440px] p-4 sm:p-6">
        <TableSkeleton rows={20} />
      </div>
    </div>
  );
}
