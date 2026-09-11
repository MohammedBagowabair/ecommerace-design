"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPriceShort, formatSarFromYer, getDiscountPercent, cn } from "@/lib/utils";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { Badge, DiscountBadge } from "@/components/ui/Badge";
import { StockOverlay } from "@/components/ui/StockBadge";
import { StarRating } from "@/components/ui/StarRating";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useToastStore } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const showToast = useToastStore((s) => s.show);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const yerPerSar = useAdminOpsStore((s) => s.settings.yerPerSar);
  const wished = has(product.id);
  const sarLabel = formatSarFromYer(product.price, yerPerSar);
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const out = product.stockStatus === "out_of_stock" || product.stock <= 0;

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
    showToast(
      added ? `أُضيفت إلى المفضلة` : `أُزيلت من المفضلة`,
      "info"
    );
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-soft group relative flex flex-col overflow-hidden p-1.5 sm:p-2.5"
    >
      {/* Gallery image — majority of card */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-cream-100 sm:aspect-square sm:rounded-2xl">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:360px) 46vw, (max-width:640px) 44vw, (max-width:1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition duration-700 motion-safe:group-hover:scale-[1.03]",
            out && "opacity-60 grayscale"
          )}
        />
        <div className="absolute start-2 top-2 flex flex-col gap-1 sm:start-2.5 sm:top-2.5 sm:gap-1.5">
          {discount && <DiscountBadge percent={discount} />}
          {product.badges
            .filter((b) => b !== "discount")
            .slice(0, 1)
            .map((b) => (
              <Badge key={b} type={b} className="hidden sm:inline-flex" />
            ))}
        </div>
        <button
          type="button"
          aria-label={wished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          onClick={onWish}
          className={cn(
            "absolute end-1.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-muted shadow-sm backdrop-blur-sm transition duration-250 sm:end-2.5 sm:top-2.5 sm:h-10 sm:w-10 sm:hover:text-henna",
            wished && "text-red-500"
          )}
        >
          <Heart
            className={cn("h-4 w-4", wished && "fill-current")}
            strokeWidth={1.5}
          />
        </button>
        <StockOverlay status={product.stockStatus} stock={product.stock} />
      </div>

      {/* Minimal chrome — name + price + quiet CTA */}
      <div className="mt-2.5 flex flex-1 flex-col gap-0.5 px-1.5 pb-1 sm:mt-3 sm:gap-1 sm:px-1 sm:pb-1.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink sm:text-sm">
          {product.name}
        </h3>
        <p className="meta-sm hidden sm:block">{product.sku}</p>
        <div className="hidden sm:block">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} showValue />
        </div>
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-2 sm:gap-2 sm:pt-2.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold tabular-nums leading-none text-henna sm:text-[0.9375rem]">
              {formatPriceShort(product.price)}
            </p>
            {sarLabel && (
              <p className="mt-0.5 hidden text-[10px] text-ink-muted sm:block">
                ≈ {sarLabel}
              </p>
            )}
            {product.compareAtPrice && (
              <p className="mt-0.5 text-[10px] text-ink-light line-through sm:mt-1 sm:text-[11px]">
                {formatPriceShort(product.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="أضيفي إلى السلة"
            onClick={onAdd}
            disabled={out}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-henna text-cream-50 shadow-sm transition duration-250 hover:bg-henna-700 active:scale-95 disabled:opacity-40 sm:h-10 sm:w-10"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </Link>
  );
}
