"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalMs: number;
};

export function getCountdownParts(endsAt: string, now = Date.now()): CountdownParts {
  const totalMs = new Date(endsAt).getTime() - now;
  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, totalMs: 0 };
  }
  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: false, totalMs };
}

/**
 * Countdown parts are computed only after mount.
 * Initializing with Date.now() during render causes SSR/client hydration
 * mismatches (e.g. Server: "11" Client: "10") when the second boundary
 * crosses between server HTML and client hydration.
 */
export function useCountdown(endsAt?: string): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (!endsAt) {
      setParts(null);
      return;
    }
    const tick = () => setParts(getCountdownParts(endsAt));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  return parts;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNIT_LABELS = ["يوم", "ساعة", "دقيقة", "ثانية"] as const;

function CountdownBoxes({
  values,
  size,
  className,
  ariaLabel,
}: {
  values: [number | null, number | null, number | null, number | null];
  size: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}) {
  const box =
    size === "lg"
      ? "min-w-[3rem] px-2.5 py-2 text-base"
      : size === "sm"
        ? "min-w-[2rem] px-1.5 py-1 text-[11px]"
        : "min-w-[2.5rem] px-2 py-1.5 text-sm";
  const labelCls = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div
      className={cn("inline-flex items-stretch gap-1.5", className)}
      dir="ltr"
      aria-label={ariaLabel}
      aria-busy={values.every((v) => v === null) || undefined}
    >
      {UNIT_LABELS.map((label, i) => {
        const value = values[i];
        return (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center rounded-xl bg-ink/90 text-white shadow-sm",
              box
            )}
          >
            <span className="font-bold tabular-nums leading-none">
              {value === null ? "--" : pad(value)}
            </span>
            <span className={cn("mt-0.5 font-medium text-white/70", labelCls)}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CountdownTimer({
  endsAt,
  size = "md",
  className,
  expiredLabel = "انتهى العرض",
}: {
  endsAt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  expiredLabel?: string;
}) {
  const parts = useCountdown(endsAt);
  if (!endsAt) return null;

  // Pre-mount: stable placeholder identical on server + first client paint
  if (!parts) {
    return (
      <CountdownBoxes
        values={[null, null, null, null]}
        size={size}
        className={className}
        ariaLabel="جاري تحميل العد التنازلي"
      />
    );
  }

  if (parts.expired) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold text-ink-muted",
          className
        )}
      >
        {expiredLabel}
      </span>
    );
  }

  return (
    <CountdownBoxes
      values={[parts.days, parts.hours, parts.minutes, parts.seconds]}
      size={size}
      className={className}
      ariaLabel={`ينتهي خلال ${parts.days} يوم و ${parts.hours} ساعة`}
    />
  );
}

export function formatOfferEndDate(endsAt: string): string {
  try {
    return new Intl.DateTimeFormat("ar-YE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
    }).format(new Date(endsAt));
  } catch {
    return endsAt;
  }
}
