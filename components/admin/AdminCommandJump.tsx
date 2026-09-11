"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { hasAnyPermission } from "@/lib/admin/permissions";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { ADMIN_NAV } from "./AdminNavConfig";
import { cn } from "@/lib/utils";

export function AdminCommandJump() {
  const router = useRouter();
  const session = useAdminAuthStore((s) => s.session);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const perms = session?.permissions ?? [];
    return ADMIN_NAV.filter((item) => hasAnyPermission(perms, item.permissions)).map(
      (item) => ({ href: item.href, label: item.label })
    );
  }, [session?.permissions]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((i) => i.label.toLowerCase().includes(query));
  }, [items, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQ("");
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="hidden items-center gap-2 rounded-xl border border-cream-300 bg-cream-50 px-2.5 py-1.5 text-xs text-ink-muted transition hover:bg-cream-100 md:inline-flex"
        onClick={() => setOpen(true)}
        aria-label="بحث سريع"
      >
        <Search className="h-3.5 w-3.5" />
        <span>انتقال سريع</span>
        <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-light shadow-sm">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center bg-ink/40 p-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-float"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="انتقال سريع"
          >
            <div className="flex items-center gap-2 border-b border-cream-200 px-3">
              <Search className="h-4 w-4 text-ink-light" />
              <input
                autoFocus
                className="flex-1 bg-transparent py-3 text-sm outline-none"
                placeholder="اذهبي إلى صفحة…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filtered[0]) {
                    router.push(filtered[0].href);
                    setOpen(false);
                  }
                }}
              />
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-cream-100"
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center rounded-xl px-3 py-2.5 text-start text-sm font-medium text-ink transition hover:bg-henna-50 hover:text-henna"
                    )}
                    onClick={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {!filtered.length && (
                <li className="px-3 py-6 text-center text-xs text-ink-muted">
                  لا نتائج
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
