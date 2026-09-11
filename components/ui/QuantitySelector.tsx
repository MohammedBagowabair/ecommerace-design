"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-cream-200 bg-cream-50 p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="تقليل الكمية"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm transition duration-250 hover:bg-cream-50 disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="h-4 w-4" strokeWidth={2} />
      </button>
      <span className="min-w-[2.75rem] text-center text-sm font-bold tabular-nums text-ink">
        {value}
      </span>
      <button
        type="button"
        aria-label="زيادة الكمية"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm transition duration-250 hover:bg-cream-50 disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
