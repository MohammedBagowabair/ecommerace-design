"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-t border-cream-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-xs text-ink-muted">
        عرض {from.toLocaleString("ar-YE")}–{to.toLocaleString("ar-YE")} من{" "}
        {total.toLocaleString("ar-YE")}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cream-300 text-ink disabled:opacity-40"
          aria-label="السابق"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <span className="px-2 text-xs font-semibold text-ink">
          {page.toLocaleString("ar-YE")} / {pages.toLocaleString("ar-YE")}
        </span>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cream-300 text-ink disabled:opacity-40"
          aria-label="التالي"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
