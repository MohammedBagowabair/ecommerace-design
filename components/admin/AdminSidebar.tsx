"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/data";
import { hasAnyPermission } from "@/lib/admin/permissions";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { ADMIN_NAV } from "./AdminNavConfig";

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname() || "";
  const session = useAdminAuthStore((s) => s.session);
  const perms = session?.permissions ?? [];

  const items = ADMIN_NAV.filter((item) =>
    hasAnyPermission(perms, item.permissions)
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-white/10 bg-henna-900 text-cream-50 transition-transform duration-200 lg:static lg:z-0 lg:translate-x-0",
          open
            ? "translate-x-0"
            : "ltr:max-lg:-translate-x-full rtl:max-lg:translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-white/10 px-4">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold text-sm font-bold text-ink">
              ن
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">{brand.name} Admin</p>
              <p className="text-[10px] text-white/50">لوحة الإدارة</p>
            </div>
          </Link>
          <button
            type="button"
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            onClick={onClose}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3" aria-label="قائمة الإدارة">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/65 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                <span className="flex-1">{item.label}</span>
                {item.stub && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/50">
                    قريبًا
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-xs text-white/50 transition hover:bg-white/8 hover:text-white/80"
            onClick={onClose}
          >
            ← العودة للمتجر
          </Link>
        </div>
      </aside>
    </>
  );
}
