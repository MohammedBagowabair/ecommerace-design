"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Building2, MapPin, Package, Truck, MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useToastStore } from "@/lib/store/toast";
import { logAdminAudit } from "@/lib/admin/audit";
import { useAdminOrders } from "@/lib/admin/use-admin-orders";
import {
  addressLabelText,
  bankAccounts,
  deliveryOptions,
} from "@/lib/data/checkout";
import {
  ORDER_STATUS_LABELS,
  formatOrderDateTime,
  orderItemCount,
} from "@/lib/order-status";
import { formatPriceShort, buildWhatsAppReceiptLink } from "@/lib/utils";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import type { OrderStatus } from "@/lib/types";

const STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const canView = useAdminAuthStore((s) => {
    const p = s.session?.permissions ?? [];
    return p.includes("orders.view") || p.includes("orders.manage");
  });
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("orders.manage")
  );
  const { getById, updateStatus } = useAdminOrders();
  const showToast = useToastStore((s) => s.show);
  const settings = useAdminOpsStore((s) => s.settings);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const session = useAdminAuthStore((s) => s.session);
  const order = getById(id);

  const [statusDraft, setStatusDraft] = useState<OrderStatus | "">("");
  const [notesDraft, setNotesDraft] = useState<string | null>(null);

  const effectiveStatus = statusDraft || order?.status || "pending_payment";
  const effectiveNotes = notesDraft ?? order?.notes ?? "";

  const delivery = useMemo(
    () => deliveryOptions.find((d) => d.id === order?.deliveryMethodId),
    [order]
  );
  const bank = useMemo(
    () => bankAccounts.find((b) => b.id === order?.bankAccountId),
    [order]
  );

  if (!canView) {
    return (
      <AdminShell title="تفاصيل الطلب">
        <PermissionDenied message="ليس لديك صلاحية عرض الطلبات." />
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell title="تفاصيل الطلب">
        <div className="rounded-2xl border border-cream-300 bg-white p-10 text-center shadow-card">
          <Package className="mx-auto h-10 w-10 text-ink-light" />
          <p className="mt-3 font-bold text-ink">لم نعثر على هذا الطلب</p>
          <Link href="/admin/orders" className="btn-primary mt-5 inline-flex">
            العودة للطلبات
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={`طلب ${order.id}`}>
      <AdminPageHeader
        title={`طلب ${order.id}`}
        breadcrumbs={[
          { label: "الطلبات", href: "/admin/orders" },
          { label: order.id },
        ]}
      />
      <div className="mb-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm font-semibold text-henna hover:underline"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للطلبات
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.status} />
        <span className="text-sm text-ink-muted">
          {formatOrderDateTime(order.createdAt)} · {orderItemCount(order.items)} منتج
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">المنتجات</h2>
            <ul className="divide-y divide-cream-100">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.name}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                    <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-xs text-ink-muted">
                      الكمية: {item.quantity} · {formatPriceShort(item.price)}
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-ink">
                    {formatPriceShort(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-cream-200 pt-3 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>المجموع الفرعي</span>
                <span>{formatPriceShort(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>الخصم</span>
                  <span>−{formatPriceShort(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-muted">
                <span>التوصيل</span>
                <span>{formatPriceShort(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-ink">
                <span>الإجمالي</span>
                <span>{formatPriceShort(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <MapPin className="h-4 w-4 text-henna" />
              العنوان والتوصيل
            </h2>
            <p className="font-semibold text-ink">{order.customer.name}</p>
            <p className="text-sm text-ink-muted" dir="ltr">
              {order.customer.phone}
            </p>
            <p className="mt-2 text-sm text-ink">
              {addressLabelText[order.address.label]} — {order.address.governorate}،{" "}
              {order.address.city}، {order.address.area}، {order.address.street}
              {order.address.details ? ` — ${order.address.details}` : ""}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
              <Truck className="h-4 w-4" />
              {delivery?.name ?? order.deliveryMethodId} ({delivery?.eta ?? "—"})
            </p>
          </section>

          <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <Building2 className="h-4 w-4 text-henna" />
              الدفع
            </h2>
            <p className="text-sm text-ink">تحويل بنكي</p>
            {bank && (
              <div className="mt-2 rounded-xl bg-cream-50 p-3 text-sm text-ink-muted">
                <p className="font-semibold text-ink">{bank.bankName}</p>
                <p>{bank.accountName}</p>
                <p dir="ltr">{bank.accountNumber}</p>
              </div>
            )}
            {order.status === "pending_payment" && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-semibold">تلميح إيصال التحويل</p>
                <p className="mt-1 leading-relaxed">
                  اطلبي من العميلة إرسال إيصال التحويل عبر واتساب قبل تأكيد الدفع.
                </p>
                <a
                  href={buildWhatsAppReceiptLink(
                    settings.whatsapp,
                    order.id,
                    formatPriceShort(order.total)
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  فتح واتساب للتذكير
                </a>
              </div>
            )}

          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">الخط الزمني</h2>
            <OrderTimeline status={order.status} />
          </section>

          <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">تغيير الحالة</h2>
            {!canManage ? (
              <p className="text-sm text-ink-muted">عرض فقط — لا يمكن تعديل الحالة.</p>
            ) : (
              <div className="space-y-3">
                <select
                  className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm"
                  value={statusDraft || order.status}
                  onChange={(e) => setStatusDraft(e.target.value as OrderStatus)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <textarea
                  className="w-full rounded-xl border border-cream-300 bg-white px-3 py-2.5 text-sm"
                  rows={3}
                  placeholder="ملاحظات داخلية (اختياري)"
                  value={effectiveNotes}
                  onChange={(e) => setNotesDraft(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => {
                    updateStatus(order.id, effectiveStatus, effectiveNotes || undefined);
                    addActivity({
                      actorName: session?.name ?? "مشرف",
                      action: "تحديث حالة طلب",
                      target: order.id,
                      entityType: "order",
                      entityId: order.id,
                      before: ORDER_STATUS_LABELS[order.status],
                      after: ORDER_STATUS_LABELS[effectiveStatus],
                      meta: ORDER_STATUS_LABELS[effectiveStatus],
                    });
                    logAdminAudit({
                      action: "تحديث حالة طلب",
                      target: order.id,
                      entityType: "order",
                      entityId: order.id,
                      before: ORDER_STATUS_LABELS[order.status],
                      after: ORDER_STATUS_LABELS[effectiveStatus],
                    });
                    setStatusDraft("");
                    setNotesDraft(null);
                    showToast("تم تحديث حالة الطلب", "success");
                  }}
                >
                  حفظ الحالة
                </button>
              </div>
            )}
            {order.notes && (
              <p className="mt-3 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900">
                ملاحظة: {order.notes}
              </p>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
