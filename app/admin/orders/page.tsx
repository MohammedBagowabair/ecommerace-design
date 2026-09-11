"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, Eye, Search, CheckSquare, MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { AdminPagination } from "@/components/admin/AdminPagination";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { useAdminOrders } from "@/lib/admin/use-admin-orders";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  derivePaymentStatus,
  formatOrderDate,
  orderItemCount,
} from "@/lib/order-status";
import { formatPriceShort, buildWhatsAppReceiptLink, cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

const ALL_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
const ALL_PAYMENTS = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];
const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const canView = useAdminAuthStore((s) => {
    const p = s.session?.permissions ?? [];
    return p.includes("orders.view") || p.includes("orders.manage");
  });
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("orders.manage")
  );
  const session = useAdminAuthStore((s) => s.session);
  const { orders, updateStatus } = useAdminOrders();
  const settings = useAdminOpsStore((s) => s.settings);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const showToast = useToastStore((s) => s.show);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [payment, setPayment] = useState<"all" | PaymentStatus>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("payment_review");
  const [bulkNotes, setBulkNotes] = useState("");
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (payment !== "all" && derivePaymentStatus(o.status) !== payment) return false;
      if (dateFrom) {
        const t = new Date(o.createdAt).getTime();
        if (t < new Date(dateFrom).getTime()) return false;
      }
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(o.createdAt).getTime() > end.getTime()) return false;
      }
      if (!query) return true;
      const hay = `${o.id} ${o.customer.name} ${o.customer.phone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [orders, q, status, payment, dateFrom, dateTo]);

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [q, status, payment, dateFrom, dateTo]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingBank = filtered.filter((o) => o.status === "pending_payment");

  const exportCsv = () => {
    const header = [
      "id",
      "customer",
      "phone",
      "status",
      "payment",
      "items",
      "total",
      "createdAt",
    ];
    const rows = filtered.map((o) => [
      o.id,
      o.customer.name,
      o.customer.phone,
      ORDER_STATUS_LABELS[o.status],
      PAYMENT_STATUS_LABELS[derivePaymentStatus(o.status)],
      String(orderItemCount(o.items)),
      String(o.total),
      o.createdAt,
    ]);
    const escape = (c: string) => `"${c.replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `naqshat-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("تم تنزيل ملف CSV (وهمي محلي)", "success");
  };

  const applyBulk = () => {
    if (!canManage || !selected.length) return;
    for (const id of selected) {
      updateStatus(id, bulkStatus, bulkNotes.trim() || undefined);
    }
    addActivity({
      actorName: session?.name ?? "مشرف",
      action: "تحديث حالة طلبات بالجملة",
      target: `${selected.length} طلب`,
      meta: ORDER_STATUS_LABELS[bulkStatus],
    });
    showToast(`تم تحديث ${selected.length} طلب`, "success");
    setSelected([]);
    setBulkNotes("");
    setConfirmBulk(false);
  };

  const clearFilters = () => {
    setQ("");
    setStatus("all");
    setPayment("all");
    setDateFrom("");
    setDateTo("");
  };

  if (!canView) {
    return (
      <AdminShell title="الطلبات">
        <PermissionDenied message="ليس لديك صلاحية عرض الطلبات." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="الطلبات">
      <AdminPageHeader
        title="الطلبات"
        description="فلترة، تصدير، وتحديث حالة بالجملة"
        breadcrumbs={[{ label: "الطلبات" }]}
        actions={
          <button type="button" className="btn-secondary w-full sm:w-auto" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            تصدير CSV
          </button>
        }
      />

      {pendingBank.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p className="text-xs leading-relaxed text-amber-900">
              <strong>{pendingBank.length}</strong> طلب بانتظار التحويل البنكي — ذكّري العميلة
              بإرسال إيصال واتساب إلى{" "}
              <span dir="ltr" className="font-semibold">
                {settings.whatsappDisplay || settings.whatsapp}
              </span>
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-xs font-semibold text-amber-800 hover:underline"
            onClick={() => setStatus("pending_payment")}
          >
            عرضها فقط
          </button>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm text-ink-muted">{filtered.length} طلب</p>
        <button
          type="button"
          className="text-xs font-semibold text-henna hover:underline lg:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
        >
          {filtersOpen ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
        </button>
      </div>

      <div
        className={cn(
          "mb-4 space-y-2 rounded-2xl border border-cream-200 bg-white p-3 shadow-card",
          !filtersOpen && "hidden lg:block"
        )}
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
            <input
              className="input-pill ps-10"
              placeholder="بحث برقم الطلب أو اسم/جوال العميلة…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="all">كل حالات الطلب</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
            value={payment}
            onChange={(e) => setPayment(e.target.value as typeof payment)}
          >
            <option value="all">كل حالات الدفع</option>
            {ALL_PAYMENTS.map((p) => (
              <option key={p} value={p}>
                {PAYMENT_STATUS_LABELS[p]}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              className="w-full rounded-full border border-cream-300 bg-white px-3 py-2.5 text-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              aria-label="من تاريخ"
            />
            <input
              type="date"
              className="w-full rounded-full border border-cream-300 bg-white px-3 py-2.5 text-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              aria-label="إلى تاريخ"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs font-semibold text-ink-muted hover:text-ink hover:underline"
            onClick={clearFilters}
          >
            مسح الفلاتر
          </button>
        </div>
      </div>

      {canManage && selected.length > 0 && (
        <div className="mb-3 space-y-2 rounded-2xl border border-henna-200 bg-henna-50/50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <CheckSquare className="h-4 w-4 text-henna" />
            <span className="text-xs font-semibold">{selected.length} طلب محدد</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select
              className="rounded-xl border border-cream-300 bg-white px-3 py-2 text-sm"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <input
              className="input-pill sm:col-span-2"
              placeholder="ملاحظة بالجملة (اختياري)"
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setConfirmBulk(true)}
            >
              تطبيق الحالة
            </button>
            <button
              type="button"
              className="text-xs text-ink-muted hover:underline"
              onClick={() => setSelected([])}
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[860px]">
            <thead>
              <tr className="text-start">
                {canManage && (
                  <th className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={
                        pageItems.length > 0 &&
                        pageItems.every((o) => selected.includes(o.id))
                      }
                      onChange={() => {
                        const ids = pageItems.map((o) => o.id);
                        const all = ids.every((id) => selected.includes(id));
                        setSelected((prev) =>
                          all
                            ? prev.filter((id) => !ids.includes(id))
                            : [...prev, ...ids.filter((id) => !prev.includes(id))]
                        );
                      }}
                      aria-label="تحديد الكل"
                    />
                  </th>
                )}
                <th className="px-4 py-2.5 font-semibold">رقم الطلب</th>
                <th className="px-4 py-2.5 font-semibold">العميلة</th>
                <th className="px-4 py-2.5 font-semibold">الحالة</th>
                <th className="px-4 py-2.5 font-semibold">الدفع</th>
                <th className="px-4 py-2.5 font-semibold">العناصر</th>
                <th className="px-4 py-2.5 font-semibold">الإجمالي</th>
                <th className="px-4 py-2.5 font-semibold">التاريخ</th>
                <th className="px-4 py-2.5 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((o) => (
                <tr key={o.id} className="border-b border-cream-100 last:border-0">
                  {canManage && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(o.id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(o.id)
                              ? prev.filter((x) => x !== o.id)
                              : [...prev, o.id]
                          )
                        }
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 font-semibold text-ink">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{o.customer.name}</div>
                    <div className="text-xs text-ink-muted" dir="ltr">
                      {o.customer.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {orderItemCount(o.items)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {formatPriceShort(o.total)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {formatOrderDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(o.id)}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink hover:bg-cream-50"
                      >
                        <Eye className="h-3 w-3" />
                        عرض
                      </Link>
                      {o.status === "pending_payment" && (
                        <a
                          href={buildWhatsAppReceiptLink(
                            settings.whatsapp,
                            o.id,
                            formatPriceShort(o.total)
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          title="تذكير واتساب"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">لا نتائج مطابقة</p>
        )}
        <AdminPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={confirmBulk}
        title="تحديث الطلبات المحددة؟"
        description={`سيتم تعيين الحالة «${ORDER_STATUS_LABELS[bulkStatus]}» لـ ${selected.length} طلب.`}
        confirmLabel="تطبيق"
        tone="default"
        onCancel={() => setConfirmBulk(false)}
        onConfirm={applyBulk}
      />
    </AdminShell>
  );
}
