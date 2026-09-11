"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  MapPin,
  MessageCircle,
  Package,
  Star,
  Truck,
} from "lucide-react";
import { useOrdersStore } from "@/lib/store/orders";
import { useReviewsStore } from "@/lib/store/reviews";
import {
  addressLabelText,
  bankAccounts,
  deliveryOptions,
  storeContact,
} from "@/lib/data/checkout";
import {
  formatOrderDateTime,
  orderItemCount,
} from "@/lib/order-status";
import {
  buildWhatsAppReceiptLink,
  formatPriceShort,
} from "@/lib/utils";
import { AccountShell } from "@/components/account/AccountNav";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/account/StatusBadge";
import {
  ReviewModal,
  type ReviewTarget,
} from "@/components/reviews/ReviewModal";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const getOrderById = useOrdersStore((s) => s.getOrderById);
  const orders = useOrdersStore((s) => s.orders);
  const ensureSeeds = useOrdersStore((s) => s.ensureSeeds);
  const hasReviewed = useReviewsStore((s) => s.hasReviewed);
  const reviewVersion = useReviewsStore((s) => s.reviews.length);
  const [mounted, setMounted] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);

  useEffect(() => {
    setMounted(true);
    ensureSeeds();
  }, [ensureSeeds]);

  if (!mounted) {
    return (
      <div className="container-pad py-10">
        <div className="h-56 animate-pulseSoft rounded-3xl bg-cream-200" />
      </div>
    );
  }

  const order = getOrderById(id) ?? orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AccountShell title="تفاصيل الطلب" backHref="/account/orders">
        <div className="rounded-3xl bg-white p-10 text-center shadow-card">
          <Package className="mx-auto h-10 w-10 text-ink-light" />
          <p className="mt-3 font-bold text-ink">لم نعثر على هذا الطلب</p>
          <p className="mt-1 text-sm text-ink-muted">
            قد يكون الرقم غير صحيح أو حُذف من التخزين المحلي.
          </p>
          <Link href="/account/orders" className="btn-primary mt-5 inline-flex">
            العودة لطلباتي
          </Link>
        </div>
      </AccountShell>
    );
  }

  const delivery = deliveryOptions.find((d) => d.id === order.deliveryMethodId);
  const bank = bankAccounts.find((b) => b.id === order.bankAccountId);
  const count = orderItemCount(order.items);
  const waLink = buildWhatsAppReceiptLink(
    storeContact.whatsapp,
    order.id,
    formatPriceShort(order.total)
  );

  return (
    <AccountShell
      title="تفاصيل الطلب"
      subtitle={formatOrderDateTime(order.createdAt)}
      backHref="/account/orders"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="text-sm text-ink-muted">
          رقم الطلب:{" "}
          <span className="font-bold text-ink" dir="ltr">
            {order.id}
          </span>
        </p>
        <OrderStatusBadge status={order.status} />
        <PaymentStatusBadge status={order.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-bold text-ink">المنتجات</h2>
            <ul className="mt-4 divide-y divide-cream-200">
              {order.items.map((item) => {
                const reviewed =
                  reviewVersion >= 0 &&
                  hasReviewed(order.id, item.productId);
                return (
                <li
                  key={`${order.id}-${item.productId}`}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      الكمية: {item.quantity}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold text-henna">
                        {formatPriceShort(item.price)}
                      </span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-xs text-ink-light line-through">
                          {formatPriceShort(item.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-xs text-ink-muted">
                        × {item.quantity} ={" "}
                        {formatPriceShort(item.price * item.quantity)}
                      </span>
                    </div>
                    {order.status === "delivered" && (
                      <div className="mt-2">
                        {reviewed ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                            <Star className="h-3 w-3 fill-current" />
                            تم التقييم
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              setReviewTarget({
                                orderId: order.id,
                                productId: item.productId,
                                productName: item.name,
                                productImage: item.image,
                              })
                            }
                            className="btn-outline gap-1.5 px-3 py-1.5 text-xs"
                          >
                            <Star className="h-3.5 w-3.5" />
                            قيّمي النقشة
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
              })}
            </ul>
            <p className="mt-3 text-xs text-ink-light">{count} منتج إجمالًا</p>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">ملخص المبالغ</h2>
            <dl className="space-y-2 text-sm">
              <Row label="المجموع الفرعي" value={formatPriceShort(order.subtotal)} />
              <Row
                label="الخصم"
                value={
                  order.discount > 0
                    ? `− ${formatPriceShort(order.discount)}`
                    : formatPriceShort(0)
                }
                valueClass={order.discount > 0 ? "text-emerald-700" : undefined}
              />
              <Row
                label="رسوم التوصيل"
                value={
                  order.deliveryFee > 0
                    ? formatPriceShort(order.deliveryFee)
                    : "مجاني"
                }
              />
              <div className="border-t border-cream-200 pt-2">
                <Row
                  label="الإجمالي"
                  value={formatPriceShort(order.total)}
                  bold
                />
              </div>
            </dl>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
              <MapPin className="h-5 w-5 text-henna" />
              عنوان التوصيل
            </h2>
            <span className="badge-pill bg-henna-50 text-henna">
              {addressLabelText[order.address.label]}
            </span>
            <p className="mt-2 font-semibold text-ink">
              {order.address.area} — {order.address.street}
            </p>
            <p className="text-sm text-ink-muted">
              {order.address.governorate}، {order.address.city}
              {order.address.details ? ` · ${order.address.details}` : ""}
            </p>
            <p className="mt-1 text-sm text-ink-muted" dir="ltr">
              {order.address.phone}
            </p>
            {order.customer.name && (
              <p className="mt-2 text-sm text-ink-muted">
                العميلة: {order.customer.name} ·{" "}
                <span dir="ltr">{order.customer.phone}</span>
              </p>
            )}
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
              <Truck className="h-5 w-5 text-henna" />
              التوصيل والدفع
            </h2>
            <p className="text-sm text-ink">
              <span className="font-semibold">طريقة التوصيل:</span>{" "}
              {delivery?.name ?? order.deliveryMethodId}
              {delivery ? ` (${delivery.eta})` : ""}
            </p>
            <p className="mt-2 text-sm text-ink">
              <span className="font-semibold">طريقة الدفع:</span> تحويل بنكي
            </p>
            {bank && (
              <div className="mt-3 rounded-2xl bg-cream-50 p-3 text-sm text-ink-muted">
                <p className="flex items-center gap-1.5 font-semibold text-ink">
                  <Building2 className="h-4 w-4 text-henna" />
                  {bank.bankName}
                </p>
                <p className="mt-1">{bank.accountName}</p>
                <p dir="ltr">{bank.accountNumber}</p>
              </div>
            )}
            {order.notes && (
              <p className="mt-3 text-sm text-ink-muted">ملاحظة: {order.notes}</p>
            )}
            {(order.status === "pending_payment" ||
              order.status === "payment_review") && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4 w-full sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                إرسال إيصال عبر واتساب
              </a>
            )}
          </section>
        </div>

        <aside className="lg:col-span-2">
          <section className="rounded-3xl bg-white p-5 shadow-card sm:sticky sm:top-24 sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-ink">مسار الطلب</h2>
            <OrderTimeline status={order.status} />
          </section>
        </aside>
      </div>

      <ReviewModal
        open={!!reviewTarget}
        target={reviewTarget}
        onClose={() => setReviewTarget(null)}
      />
    </AccountShell>
  );
}

function Row({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={bold ? "font-bold text-ink" : "text-ink-muted"}>{label}</dt>
      <dd
        className={
          valueClass ??
          (bold ? "text-base font-bold text-henna" : "font-semibold text-ink")
        }
      >
        {value}
      </dd>
    </div>
  );
}
