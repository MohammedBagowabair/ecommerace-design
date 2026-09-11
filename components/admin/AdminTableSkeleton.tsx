import { Skeleton } from "@/components/ui/Skeleton";

export function AdminTableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-cream-300 bg-white p-4 shadow-card"
      aria-busy
      aria-label="جاري التحميل"
    >
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="hidden h-10 w-32 rounded-full sm:block" />
        <Skeleton className="hidden h-10 w-32 rounded-full md:block" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full rounded-xl" />
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-2">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-12 flex-1 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminKpiSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-busy>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-2xl" />
      ))}
    </div>
  );
}
