import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatPriceShort } from "@/lib/utils";
import {
  formatOrderDate,
  orderItemCount,
} from "@/lib/order-status";
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge";

export function OrderCard({ order }: { order: Order }) {
  const count = orderItemCount(order.items);
  const thumbs = order.items.slice(0, 3);

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="block rounded-3xl bg-white p-4 shadow-card transition hover:shadow-soft sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-ink-light">رقم الطلب</p>
          <p className="font-bold text-ink" dir="ltr">
            {order.id}
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2 space-x-reverse">
          {thumbs.map((item) => (
            <span
              key={`${order.id}-${item.productId}`}
              className="relative h-12 w-12 overflow-hidden rounded-xl bg-cream-100 ring-2 ring-white"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </span>
          ))}
          {order.items.length > 3 && (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream-100 text-xs font-bold text-ink-muted ring-2 ring-white">
              +{order.items.length - 3}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm text-ink-muted">
            <Package className="h-3.5 w-3.5" />
            {count} منتج
          </p>
          <p className="mt-0.5 text-base font-bold text-henna">
            {formatPriceShort(order.total)}
          </p>
        </div>
        <ChevronLeft className="h-5 w-5 shrink-0 rotate-180 text-ink-light" />
      </div>
    </Link>
  );
}
