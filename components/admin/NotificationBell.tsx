"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const notifications = useAdminOpsStore((s) => s.notifications);
  const markRead = useAdminOpsStore((s) => s.markNotificationRead);
  const markAll = useAdminOpsStore((s) => s.markAllNotificationsRead);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unread = notifications.filter((n) => !n.read).length;
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="relative rounded-xl p-2 text-ink hover:bg-cream-100"
        aria-label={unread ? `${unread} إشعارات غير مقروءة` : "الإشعارات"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-1 w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-float">
          <div className="flex items-center justify-between border-b border-cream-200 px-3 py-2.5">
            <p className="text-sm font-bold text-ink">الإشعارات</p>
            {unread > 0 && (
              <button
                type="button"
                className="text-[11px] font-semibold text-henna hover:underline"
                onClick={() => markAll()}
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {sorted.length === 0 ? (
              <li className="px-3 py-8 text-center text-xs text-ink-muted">
                لا إشعارات
              </li>
            ) : (
              sorted.map((n) => (
                <li key={n.id} className="border-b border-cream-100 last:border-0">
                  {n.href ? (
                    <Link
                      href={n.href}
                      className={cn(
                        "block px-3 py-2.5 transition hover:bg-cream-50",
                        !n.read && "bg-henna-50/40"
                      )}
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                      }}
                    >
                      <p className="text-xs font-bold text-ink">{n.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[10px] text-ink-light">
                        {new Date(n.createdAt).toLocaleString("ar-YE", {
                          timeZone: "Asia/Riyadh",
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={cn(
                        "block w-full px-3 py-2.5 text-start transition hover:bg-cream-50",
                        !n.read && "bg-henna-50/40"
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <p className="text-xs font-bold text-ink">{n.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-ink-muted">
                        {n.body}
                      </p>
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
