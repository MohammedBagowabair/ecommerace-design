"use client";

import { X, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

const tones = {
  success: "border-emerald-400/40 text-emerald-300",
  info: "border-gold-300/40 text-gold-300",
  error: "border-red-400/50 text-red-300",
};

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore();
  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 start-4 end-4 z-[100] flex flex-col gap-2 sm:bottom-8 sm:start-auto sm:end-6 sm:w-80"
      aria-live="polite"
      aria-relevant="additions"
    >
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl border bg-ink px-4 py-3 text-white shadow-float animate-slideUp",
              tones[t.type]
            )}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm leading-relaxed text-white">{t.message}</p>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => dismiss(t.id)}
              className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
