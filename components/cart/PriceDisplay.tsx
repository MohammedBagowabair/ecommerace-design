import { formatPriceShort, cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "sm",
  className,
}: {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const discounted = Boolean(compareAtPrice && compareAtPrice > price);
  const priceCls =
    size === "lg"
      ? "text-xl font-bold"
      : size === "md"
        ? "text-base font-bold"
        : "text-sm font-bold";
  const oldCls =
    size === "lg" ? "text-sm" : size === "md" ? "text-xs" : "text-[11px]";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn(priceCls, "text-henna")}>{formatPriceShort(price)}</span>
      {discounted && (
        <span className={cn(oldCls, "text-ink-light line-through")}>
          {formatPriceShort(compareAtPrice!)}
        </span>
      )}
    </div>
  );
}
