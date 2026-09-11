"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "تأكيد",
  cancelLabel = "إلغاء",
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? "confirm-dialog-desc" : undefined}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-slideUp rounded-t-3xl bg-white p-5 shadow-float sm:animate-fadeIn sm:rounded-3xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
              tone === "danger" ? "bg-red-50 text-red-600" : "bg-henna-50 text-henna"
            )}
          >
            <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 id="confirm-dialog-title" className="text-lg font-bold text-ink">
                {title}
              </h2>
              <button
                type="button"
                aria-label="إغلاق"
                onClick={onCancel}
                className="rounded-full p-1.5 text-ink-light hover:bg-cream-100 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {description && (
              <p id="confirm-dialog-desc" className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-outline w-full sm:w-auto" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.98] sm:w-auto",
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-ink hover:bg-henna-600"
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
