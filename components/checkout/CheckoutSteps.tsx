"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = [
  { id: "customer", label: "بياناتك" },
  { id: "address", label: "العنوان" },
  { id: "delivery", label: "التوصيل" },
  { id: "payment", label: "الدفع" },
  { id: "review", label: "المراجعة" },
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

  return (
    <ol className="flex w-full items-start">
      {CHECKOUT_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const isLast = index === CHECKOUT_STEPS.length - 1;
        return (
          <li
            key={step.id}
            className="relative flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute start-1/2 top-5 h-0.5 w-full -translate-y-1/2",
                  done || active ? "bg-henna/40" : "bg-cream-200"
                )}
              />
            )}
            <span
              className={cn(
                "relative z-[1] flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition duration-250",
                done && "bg-henna text-white shadow-sm",
                active && "bg-ink text-white shadow-md ring-4 ring-henna-100",
                !done && !active && "bg-cream-200 text-ink-light"
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : index + 1}
            </span>
            <span
              className={cn(
                "relative z-[1] max-w-full truncate px-0.5 text-center text-[10px] font-semibold sm:text-xs",
                active ? "text-ink" : done ? "text-henna" : "text-ink-light"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
