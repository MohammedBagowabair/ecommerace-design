import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulseSoft rounded-2xl bg-cream-200", className)}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-soft overflow-hidden p-2.5 sm:p-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="mt-3 space-y-2 px-0.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("container-pad space-y-4 py-8", className)} aria-busy>
      <Skeleton className="h-8 w-48 rounded-full" />
      <Skeleton className="h-4 w-72 max-w-full rounded-full" />
      <Skeleton className="mt-4 h-40 w-full rounded-3xl" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-3xl" />
      ))}
    </div>
  );
}
