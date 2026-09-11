import { cn } from "@/lib/utils";
import type { ProductBadge } from "@/lib/types";

const labels: Record<ProductBadge, string> = {
  new: "جديد",
  featured: "مميز",
  bestseller: "الأكثر طلبًا",
  discount: "خصم",
  limited: "محدود",
};

const styles: Record<ProductBadge, string> = {
  new: "bg-henna text-white",
  featured: "bg-gold text-white",
  bestseller: "bg-ink text-white",
  discount: "bg-red-600 text-white shadow-sm ring-1 ring-red-700/20",
  limited: "bg-henna-700 text-white",
};

export function Badge({
  type,
  className,
  children,
}: {
  type?: ProductBadge;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!type && !children) return null;
  return (
    <span className={cn("badge-pill", type ? styles[type] : "bg-cream-200 text-ink", className)}>
      {children ?? (type ? labels[type] : null)}
    </span>
  );
}

/** Consistent discount chip used on product cards, offer cards, and PDP */
export function DiscountBadge({
  percent,
  size = "sm",
  className,
}: {
  percent: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Badge
      type="discount"
      className={cn(
        "font-bold tracking-tight",
        size === "md" && "px-3 py-1 text-xs",
        className
      )}
    >
      خصم {percent}%
    </Badge>
  );
}
