"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function AdminBreadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <nav aria-label="مسار التنقل" className={cn("mb-3", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-muted">
        <li>
          <Link href="/admin" className="hover:text-henna hover:underline">
            لوحة التحكم
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              <ChevronLeft className="h-3 w-3 shrink-0 text-ink-light" aria-hidden />
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-henna hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(last && "font-semibold text-ink")}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
