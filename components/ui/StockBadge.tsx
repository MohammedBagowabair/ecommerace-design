import { cn, getStockLabel } from "@/lib/utils";
import type { StockStatus } from "@/lib/types";

export function StockBadge({
  status,
  stock,
  className,
  size = "sm",
}: {
  status: StockStatus;
  stock: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const out = status === "out_of_stock" || stock <= 0;
  const low = !out && (status === "low_stock" || stock <= 5);

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full font-semibold",
        size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        out
          ? "bg-red-50 text-red-700"
          : low
            ? "bg-amber-50 text-amber-800"
            : "bg-emerald-50 text-emerald-700",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          out ? "bg-red-500" : low ? "bg-amber-500" : "bg-emerald-500"
        )}
        aria-hidden
      />
      {getStockLabel(out ? "out_of_stock" : low ? "low_stock" : status, stock)}
    </span>
  );
}

/** Overlay chip for product card images */
export function StockOverlay({
  status,
  stock,
}: {
  status: StockStatus;
  stock: number;
}) {
  const out = status === "out_of_stock" || stock <= 0;
  const low = !out && (status === "low_stock" || stock <= 5);
  if (!out && !low) return null;

  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 py-1.5 text-center text-[11px] font-semibold text-white sm:text-xs",
        out ? "bg-ink/75" : "bg-amber-600/90"
      )}
    >
      {out ? "نفدت الكمية" : `متبقي ${stock} فقط`}
    </div>
  );
}
