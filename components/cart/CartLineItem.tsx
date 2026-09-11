"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPriceShort, cn } from "@/lib/utils";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { PriceDisplay } from "./PriceDisplay";

export function CartLineItem({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  compact = false,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  const out = product.stockStatus === "out_of_stock" || product.stock <= 0;
  const max = out ? quantity : Math.max(1, product.stock);
  const lineTotal = product.price * quantity;
  const lineCompare =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice * quantity
      : undefined;

  return (
    <div
      className={cn(
        "flex gap-3 rounded-3xl bg-white p-3 shadow-card sm:gap-4",
        compact ? "p-2.5" : "sm:p-4",
        out && "opacity-90 ring-1 ring-red-100"
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl bg-cream-100",
          compact ? "h-20 w-20" : "h-24 w-24 sm:h-28 sm:w-28"
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={cn("object-cover", out && "grayscale")}
          sizes="112px"
        />
        {out && (
          <span className="absolute inset-x-0 bottom-0 bg-red-600/90 py-0.5 text-center text-[10px] font-bold text-white">
            نفدت
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-sm font-bold text-ink hover:text-henna"
            >
              {product.name}
            </Link>
            {out ? (
              <p className="mt-1 text-xs font-semibold text-red-600">
                غير متوفر حاليًا — لن يُحسب في الطلب
              </p>
            ) : product.stockStatus === "low_stock" ? (
              <p className="mt-1 text-xs text-amber-700">متبقي {product.stock} فقط</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="حذف من السلة"
            className="shrink-0 rounded-full p-2 text-ink-light transition hover:bg-red-50 hover:text-red-600"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-1">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          {out ? (
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
              لا يمكن زيادة الكمية
            </span>
          ) : (
            <QuantitySelector
              value={quantity}
              onChange={onQuantityChange}
              max={max}
              min={1}
            />
          )}
          <div className="text-start">
            <p className="text-sm font-bold text-ink">{formatPriceShort(lineTotal)}</p>
            {lineCompare && (
              <p className="text-[11px] text-ink-light line-through">
                {formatPriceShort(lineCompare)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
