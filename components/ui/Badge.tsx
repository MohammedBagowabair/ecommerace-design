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
  new: "bg-ink text-white",
  featured: "bg-rose-500 text-white",
  bestseller: "bg-ink text-white",
  discount: "bg-rose-600 text-white",
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
        size === "md" && "px-2.5 py-1 text-xs",
        className
      )}
    >
      -{percent}%
    </Badge>
  );
}
