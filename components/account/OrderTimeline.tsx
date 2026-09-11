import { Check, X } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  ORDER_TIMELINE_STEPS,
  getTimelineIndex,
} from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-3xl bg-red-50 p-5 ring-1 ring-red-100">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <X className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-red-800">تم إلغاء الطلب</p>
            <p className="text-sm text-red-700/80">
              لن يُكمل هذا الطلب مسار التجهيز والتوصيل.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const current = getTimelineIndex(status);

  return (
    <ol className="relative space-y-0">
      {ORDER_TIMELINE_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const upcoming = i > current;
        return (
          <li key={step} className="relative flex gap-3 pb-6 last:pb-0">
            {i < ORDER_TIMELINE_STEPS.length - 1 && (
              <span
                className={cn(
                  "absolute start-[15px] top-8 h-[calc(100%-1.25rem)] w-0.5",
                  done || active ? "bg-henna-300" : "bg-cream-300"
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                done && "bg-henna text-white",
                active && "bg-henna text-white ring-4 ring-henna-100",
                upcoming && "bg-cream-200 text-ink-light"
              )}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
            </span>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-bold",
                  active ? "text-henna" : done ? "text-ink" : "text-ink-light"
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
              {active && (
                <p className="mt-0.5 text-xs text-ink-muted">الحالة الحالية</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
