"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ScrollText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import type { AuditEntityType } from "@/lib/admin/ops-types";
import { formatOrderDateTime } from "@/lib/order-status";

const PAGE_SIZE = 12;

const ENTITY_LABELS: Record<AuditEntityType | "all", string> = {
  all: "كل الكيانات",
  order: "طلب",
  product: "منتج",
  category: "قسم",
  offer: "عرض",
  user: "مستخدم",
  role: "دور",
  settings: "إعدادات",
  auth: "مصادقة",
  media: "وسائط",
  system: "نظام",
};

export default function AdminActivityPage() {
  const canView = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("dashboard.view")
  );
  const activity = useAdminOpsStore((s) => s.activity);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const [q, setQ] = useState("");
  const [actor, setActor] = useState("all");
  const [entityType, setEntityType] = useState<AuditEntityType | "all">("all");
  const [actionType, setActionType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const actors = useMemo(() => {
    const set = new Set(activity.map((a) => a.actorName).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [activity]);

  const actions = useMemo(() => {
    const set = new Set(activity.map((a) => a.action).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [activity]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = [...activity].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (actor !== "all") list = list.filter((a) => a.actorName === actor);
    if (entityType !== "all") list = list.filter((a) => a.entityType === entityType);
    if (actionType !== "all") list = list.filter((a) => a.action === actionType);
    if (fromDate) {
      const t = new Date(fromDate).getTime();
      list = list.filter((a) => new Date(a.createdAt).getTime() >= t);
    }
    if (toDate) {
      const t = new Date(toDate).getTime() + 86_400_000 - 1;
      list = list.filter((a) => new Date(a.createdAt).getTime() <= t);
    }
    if (query) {
      list = list.filter((a) => {
        const hay = [
          a.actorName,
          a.action,
          a.target,
          a.meta ?? "",
          a.entityId ?? "",
          a.entityType ?? "",
          a.before ?? "",
          a.after ?? "",
          a.ip ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      });
    }
    return list;
  }, [activity, q, actor, entityType, actionType, fromDate, toDate]);

  useEffect(() => {
    setPage(1);
  }, [q, actor, entityType, actionType, fromDate, toDate]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (!canView) {
    return (
      <AdminShell title="سجل التدقيق">
        <PermissionDenied message="ليس لديك صلاحية عرض سجل التدقيق." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="سجل التدقيق">
      <AdminPageHeader
        title="سجل التدقيق الكامل"
        description="من فعل ماذا، على أي كيان، قبل/بعد، والوقت — مخزّن محليًا"
        breadcrumbs={[{ label: "سجل التدقيق" }]}
      />

      <div className="mb-4 grid gap-3 rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="block text-xs sm:col-span-2 xl:col-span-2">
          <span className="mb-1 block font-semibold text-ink-muted">بحث</span>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              className="input-pill ps-10"
              placeholder="مستخدم، إجراء، كيان، IP…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </label>
        <label className="block text-xs">
          <span className="mb-1 block font-semibold text-ink-muted">المستخدم</span>
          <select className="input-pill" value={actor} onChange={(e) => setActor(e.target.value)}>
            {actors.map((a) => (
              <option key={a} value={a}>
                {a === "all" ? "الكل" : a}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="mb-1 block font-semibold text-ink-muted">نوع الكيان</span>
          <select
            className="input-pill"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value as AuditEntityType | "all")}
          >
            {(Object.keys(ENTITY_LABELS) as (AuditEntityType | "all")[]).map((k) => (
              <option key={k} value={k}>
                {ENTITY_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="mb-1 block font-semibold text-ink-muted">الإجراء</span>
          <select
            className="input-pill"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            {actions.map((a) => (
              <option key={a} value={a}>
                {a === "all" ? "الكل" : a}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="mb-1 block font-semibold text-ink-muted">من تاريخ</span>
          <input
            type="date"
            className="input-pill"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label className="block text-xs">
          <span className="mb-1 block font-semibold text-ink-muted">إلى تاريخ</span>
          <input
            type="date"
            className="input-pill"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
      </div>

      <p className="mb-3 text-sm text-ink-muted">{filtered.length} حدث</p>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-card">
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <ScrollText className="h-10 w-10 text-ink-light" />
            <p className="mt-3 text-sm font-semibold text-ink">لا أحداث مطابقة</p>
            <p className="mt-1 text-xs text-ink-muted">عدّلي عوامل التصفية أو البحث</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="admin-table min-w-[920px]">
                <thead>
                  <tr className="text-start">
                    <th className="px-4 py-2.5">الوقت</th>
                    <th className="px-4 py-2.5">من</th>
                    <th className="px-4 py-2.5">الإجراء</th>
                    <th className="px-4 py-2.5">الكيان</th>
                    <th className="px-4 py-2.5">قبل → بعد</th>
                    <th className="px-4 py-2.5">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((a) => (
                    <tr key={a.id} className="border-b border-cream-100 last:border-0 align-top">
                      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                        {formatOrderDateTime(a.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-ink">{a.actorName}</p>
                        {a.actorId && (
                          <p className="text-[10px] text-ink-light" dir="ltr">
                            {a.actorId}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-ink">{a.action}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-henna">{a.target}</p>
                        <p className="text-[10px] text-ink-muted">
                          {a.entityType
                            ? ENTITY_LABELS[a.entityType]
                            : "—"}
                          {a.entityId ? ` · ${a.entityId}` : ""}
                        </p>
                        {a.meta && (
                          <p className="mt-0.5 text-[11px] text-ink-light">{a.meta}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-muted">
                        {a.before || a.after ? (
                          <span>
                            <span className="text-ink-light">{a.before || "—"}</span>
                            <span className="mx-1">→</span>
                            <span className="font-semibold text-ink">{a.after || "—"}</span>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-light" dir="ltr">
                        {a.ip || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
