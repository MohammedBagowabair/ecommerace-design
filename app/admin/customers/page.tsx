"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Search, UsersRound } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOrders } from "@/lib/admin/use-admin-orders";
import { deriveCustomers } from "@/lib/admin/merged-catalog";
import { formatPriceShort } from "@/lib/utils";

export default function AdminCustomersPage() {
  const canView = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("customers.view")
  );
  const { orders } = useAdminOrders();
  const [q, setQ] = useState("");

  const customers = useMemo(() => deriveCustomers(orders), [orders]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((c) => {
      const hay = `${c.name} ${c.phone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [customers, q]);

  if (!canView) {
    return (
      <AdminShell title="العملاء">
        <PermissionDenied message="ليس لديك صلاحية عرض العملاء." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="العملاء">
      <AdminPageHeader
        title="العملاء"
        description="مستخرجون من الطلبات — عرض فقط"
        breadcrumbs={[{ label: "العملاء" }]}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">{filtered.length} عميلة</p>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            className="input-pill ps-10"
            placeholder="بحث بالاسم أو الجوال…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[680px]">
            <thead>
              <tr className="text-start">
                <th className="px-4 py-2.5 font-semibold">الاسم</th>
                <th className="px-4 py-2.5 font-semibold">الجوال</th>
                <th className="px-4 py-2.5 font-semibold">الطلبات</th>
                <th className="px-4 py-2.5 font-semibold">إجمالي الإنفاق</th>
                <th className="px-4 py-2.5 font-semibold">آخر طلب</th>
                <th className="px-4 py-2.5 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-cream-100 last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-muted" dir="ltr">
                    {c.phone}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{c.orderCount}</td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {formatPriceShort(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {c.lastOrderAt
                      ? new Date(c.lastOrderAt).toLocaleDateString("ar-YE", {
                          timeZone: "Asia/Riyadh",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${encodeURIComponent(c.id)}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink hover:bg-cream-50"
                    >
                      <Eye className="h-3 w-3" />
                      عرض
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <UsersRound className="h-10 w-10 text-ink-light" />
            <p className="mt-3 text-sm font-semibold text-ink">لا عميلات مطابقات</p>
            <p className="mt-1 text-xs text-ink-muted">ستظهر العميلات تلقائيًا من الطلبات</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
