"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, CalendarClock } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPriceShort, getDiscountPercent, cn } from "@/lib/utils";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer, formatOfferEndDate } from "@/components/ui/Countdown";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useToastStore } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";

export function OfferCard({
  product,
  endsAt,
  offerTitle,
}: {
  product: Product;
  endsAt?: string;
  offerTitle?: string;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const showToast = useToastStore((s) => s.show);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const wished = has(product.id);
  const computedDiscount =
    getDiscountPercent(product.price, product.compareAtPrice) ??
    (product.isOffer ? 10 : null);
  const discount = computedDiscount;
  const out = product.stockStatus === "out_of_stock" || product.stock <= 0;
  const oldPrice =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : discount
        ? Math.round(product.price / (1 - discount / 100))
        : product.price;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (out) {
      showToast("نفدت الكمية من هذا المنتج", "error");
      return;
    }
    const ok = addItem(product.id, 1, product.stock);
    if (!ok) {
      showToast("لا يمكن إضافة المزيد من هذا المنتج", "error");
      return;
    }
    showToast(`تمت إضافة «${product.name}» إلى السلة`);
    openCart();
  };

  const onWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggle(product.id);
    showToast(added ? "أُضيفت إلى المفضلة" : "أُزيلت من المفضلة", "info");
  };

  return (
    <article className="card-soft group flex flex-col overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition duration-500 group-hover:scale-105",
            out && "opacity-60 grayscale"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {discount != null && <DiscountBadge percent={discount} size="md" />}
          {offerTitle && (
            <span className="badge-pill bg-white/95 text-henna shadow-sm backdrop-blur">
              {offerTitle}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label={wished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          onClick={onWish}
          className={cn(
            "absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-105",
            wished && "text-red-500"
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
        {out && (
          <div className="absolute inset-x-0 bottom-0 bg-ink/75 py-2 text-center text-xs font-semibold text-white">
            نفدت الكمية
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="hover:text-henna">
              {product.name}
            </Link>
          </h3>
          {product.occasion && (
            <p className="mt-1 text-xs font-medium text-gold-600">مناسبة: {product.occasion}</p>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <span className="text-lg font-bold text-henna">{formatPriceShort(product.price)}</span>
          <span className="text-sm text-ink-light line-through">{formatPriceShort(oldPrice)}</span>
          {discount != null && (
            <span className="text-xs font-semibold text-red-600">وفّري {discount}%</span>
          )}
        </div>

        {endsAt && (
          <div className="rounded-2xl bg-cream-100/80 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted">
              <CalendarClock className="h-3.5 w-3.5 text-henna" />
              <span>ينتهي: {formatOfferEndDate(endsAt)}</span>
            </div>
            <CountdownTimer endsAt={endsAt} size="sm" />
          </div>
        )}

        <button
          type="button"
          onClick={onAdd}
          disabled={out}
          className="btn-primary mt-auto w-full disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" />
          أضيفي إلى السلة
        </button>
      </div>
    </article>
  );
}
