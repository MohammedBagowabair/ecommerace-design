import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = "sm",
  showValue = false,
  reviewCount,
}: {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
  reviewCount?: number;
}) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              className={cn(sz, filled ? "fill-gold text-gold" : "text-cream-300")}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-ink-muted">
          {rating.toFixed(1)}
          {typeof reviewCount === "number" && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
