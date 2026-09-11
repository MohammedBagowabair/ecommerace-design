"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<number, string> = {
  1: "ضعيف",
  2: "مقبول",
  3: "جيد",
  4: "جيد جدًا",
  5: "ممتاز",
};

export function StarPicker({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (n: number) => void;
  size?: "md" | "lg";
}) {
  const sz = size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="التقييم بالنجوم">
        {Array.from({ length: 5 }).map((_, i) => {
          const star = i + 1;
          const filled = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} نجوم`}
              onClick={() => onChange(star)}
              className={cn(
                "rounded-full p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300",
                filled ? "text-gold" : "text-cream-300 hover:text-gold-300"
              )}
            >
              <Star className={cn(sz, filled && "fill-gold")} />
            </button>
          );
        })}
      </div>
      <p className="text-xs text-ink-muted">
        {value > 0 ? LABELS[value] : "اختاري عدد النجوم"}
      </p>
    </div>
  );
}
