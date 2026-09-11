"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ScrollText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";

const PAGE_SIZE = 10;

export default function AdminActivityPage() {
  const canView = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("dashboard.view")
  );
  const activity = useAdminOpsStore((s) => s.activity);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = [...activity].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!query) return list;
    return list.filter((a) => {
      const hay = `${a.actorName} ${a.action} ${a.target} ${a.meta ?? ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [activity, q]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!canView) {
    return (
      <AdminShell title="سجل النشاط">
        <PermissionDenied message="ليس لديك صلاحية عرض سجل النشاط." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="سجل النشاط">
      <AdminPageHeader
        title="سجل النشاط"
        description="أحداث تدقيق وهمية — تسجيل الدخول، تعديل الطلبات والمنتجات والصلاحيات"
        breadcrumbs={[{ label: "سجل النشاط" }]}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">{filtered.length} حدث</p>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            className="input-pill ps-10"
            placeholder="بحث في السجل…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-card">
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <ScrollText className="h-10 w-10 text-ink-light" />
            <p className="mt-3 text-sm font-semibold text-ink">لا أحداث مطابقة</p>
            <p className="mt-1 text-xs text-ink-muted">جرّبي كلمات بحث أخرى</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-cream-100">
              {pageItems.map((a) => (
                <li key={a.id} className="flex gap-3 px-4 py-3.5 sm:px-5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-henna-50 text-xs font-bold text-henna">
                    {a.actorName.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">
                      <span className="font-bold">{a.actorName}</span>
                      <span className="text-ink-muted"> — {a.action}</span>
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-henna">{a.target}</p>
                    {a.meta && (
                      <p className="mt-0.5 text-[11px] text-ink-muted">{a.meta}</p>
                    )}
                    <p className="mt-1 text-[10px] text-ink-light">
                      {new Date(a.createdAt).toLocaleString("ar-YE", {
                        timeZone: "Asia/Riyadh",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <AdminPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </AdminShell>
  );
}
