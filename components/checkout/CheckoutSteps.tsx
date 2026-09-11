"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = [
  { id: "customer", label: "بياناتك", short: "بيانات" },
  { id: "address", label: "العنوان", short: "عنوان" },
  { id: "delivery", label: "التوصيل", short: "توصيل" },
  { id: "payment", label: "الدفع", short: "دفع" },
  { id: "review", label: "المراجعة", short: "مراجعة" },
] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number]["id"];

export function CheckoutSteps({
  current,
}: {
  current: CheckoutStepId | "success";
}) {
  const currentIndex =
    current === "success"
      ? CHECKOUT_STEPS.length
      : CHECKOUT_STEPS.findIndex((s) => s.id === current);

  const currentLabel =
    current === "success"
      ? "تم"
      : CHECKOUT_STEPS[currentIndex]?.label ?? "";

  return (
    <div>
      <p className="mb-3 text-center text-sm font-semibold text-ink sm:hidden">
        الخطوة {Math.min(currentIndex + 1, CHECKOUT_STEPS.length)} من{" "}
        {CHECKOUT_STEPS.length}
        {currentLabel ? ` · ${currentLabel}` : ""}
      </p>
      <ol className="flex w-full items-start">
        {CHECKOUT_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          const isLast = index === CHECKOUT_STEPS.length - 1;
          return (
            <li
              key={step.id}
              className="relative flex min-w-0 flex-1 flex-col items-center gap-1.5 sm:gap-2"
            >
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute start-1/2 top-4 h-0.5 w-full -translate-y-1/2 sm:top-5",
                    done || active ? "bg-henna/40" : "bg-cream-200"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-[1] flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition duration-250 sm:h-10 sm:w-10 sm:text-xs",
                  done && "bg-henna text-white shadow-sm",
                  active && "bg-ink text-white shadow-md ring-4 ring-henna-100",
                  !done && !active && "bg-cream-200 text-ink-light"
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} /> : index + 1}
              </span>
              <span
                className={cn(
                  "relative z-[1] max-w-full truncate px-0.5 text-center text-[10px] font-semibold sm:text-xs",
                  active ? "text-ink" : done ? "text-henna" : "text-ink-light",
                  !active && "hidden sm:block"
                )}
              >
                <span className="sm:hidden">{step.short}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
