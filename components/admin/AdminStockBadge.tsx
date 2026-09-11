import { cn } from "@/lib/utils";
import type { StockStatus } from "@/lib/types";
import { getStockLabel } from "@/lib/utils";

export function AdminStockBadge({
  status,
  stock,
  className,
}: {
  status: StockStatus;
  stock: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-col items-start gap-0.5",
        className
      )}
    >
      <span
        className={cn(
          "badge-pill",
          status === "out_of_stock" && "bg-red-50 text-red-700",
          status === "low_stock" && "bg-amber-50 text-amber-800",
          status === "in_stock" && "bg-emerald-50 text-emerald-700"
        )}
      >
        {getStockLabel(status, stock)}
      </span>
      <span className="text-[10px] text-ink-light">
        الكمية: {stock.toLocaleString("ar-YE")}
      </span>
    </span>
  );
}
