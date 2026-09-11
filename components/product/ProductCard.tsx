"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, ShoppingBag } from "lucide-react";
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
      className="card-soft group relative flex flex-col overflow-hidden p-2 sm:p-3.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-100 sm:rounded-[1.25rem]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:360px) 46vw, (max-width:640px) 44vw, (max-width:1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition duration-500 motion-safe:group-hover:scale-105",
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
            "absolute end-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition duration-250 sm:end-2.5 sm:top-2.5 sm:h-11 sm:w-11 sm:hover:scale-105 sm:hover:shadow-md",
            wished && "text-red-500"
          )}
        >
          <Heart
            className={cn("h-[1.125rem] w-[1.125rem]", wished && "fill-current")}
            strokeWidth={1.75}
          />
        </button>
        <StockOverlay status={product.stockStatus} stock={product.stock} />
      </div>

      <div className="mt-2.5 flex flex-1 flex-col gap-1 px-0.5 sm:mt-3.5 sm:gap-1.5">
        <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-ink sm:text-[0.9375rem]">
          {product.name}
        </h3>
        <p className="meta-sm hidden tracking-wide sm:block">{product.sku}</p>
        <div className="hidden sm:block">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} showValue />
        </div>
        <div className="mt-auto flex items-end justify-between gap-1.5 pt-2 sm:gap-2 sm:pt-3">
          <div className="min-w-0">
            <p className="text-sm font-bold tabular-nums leading-none text-henna sm:text-base">
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-sm transition duration-250 hover:bg-henna hover:shadow-md active:scale-95 disabled:opacity-40 sm:h-11 sm:w-11"
          >
            <Plus className="h-5 w-5 sm:hidden" strokeWidth={2} />
            <ShoppingBag
              className="hidden h-[1.125rem] w-[1.125rem] sm:block"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
