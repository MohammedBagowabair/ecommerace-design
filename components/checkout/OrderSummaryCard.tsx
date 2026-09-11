"use client";

import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPriceShort } from "@/lib/utils";

export function OrderSummaryCard({
  rows,
  subtotal,
  discount,
  deliveryFee,
  total,
  compact = false,
}: {
  rows: { product: Product; quantity: number }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  compact?: boolean;
}) {
  return (
    <aside className="h-fit rounded-3xl border border-cream-200/60 bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
      <h2 className="font-bold text-ink">ملخص الطلب</h2>
      <ul className={compact ? "mt-3 space-y-2" : "mt-4 space-y-3"}>
        {rows.map(({ product, quantity }) => (
          <li key={product.id} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {product.shortName ?? product.name}
              </p>
              <p className="text-xs text-ink-muted">
                ×{quantity} · {formatPriceShort(product.price)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold text-ink">
              {formatPriceShort(product.price * quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-cream-200 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">المجموع الفرعي</dt>
          <dd className="font-semibold text-ink">{formatPriceShort(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-ink-muted">الخصم</dt>
            <dd className="font-semibold text-emerald-700">
              −{formatPriceShort(discount)}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <dt className="text-ink-muted">رسوم التوصيل</dt>
          <dd className="font-semibold text-ink">
            {deliveryFee === 0 ? "مجاني" : formatPriceShort(deliveryFee)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-cream-200 pt-3">
          <dt className="font-bold text-ink">الإجمالي</dt>
          <dd className="text-lg font-bold text-henna">
            {formatPriceShort(total)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-ink-light">الأسعار بالريال اليمني (YER)</p>
    </aside>
  );
}
