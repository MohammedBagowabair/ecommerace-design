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
      className="card-soft group relative flex flex-col overflow-hidden p-3 sm:p-3.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.25rem] bg-cream-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          className={cn(
            "object-cover transition duration-500 group-hover:scale-105",
            out && "opacity-60 grayscale"
          )}
        />
        <div className="absolute start-2.5 top-2.5 flex flex-col gap-1.5">
          {discount && <DiscountBadge percent={discount} />}
          {product.badges
            .filter((b) => b !== "discount")
            .slice(0, 2)
            .map((b) => (
              <Badge key={b} type={b} />
            ))}
        </div>
        <button
          type="button"
          aria-label={wished ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          onClick={onWish}
          className={cn(
            "absolute end-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition duration-250 hover:scale-105 hover:shadow-md",
            wished && "text-red-500"
          )}
        >
          <Heart className={cn("h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]", wished && "fill-current")} strokeWidth={1.75} />
        </button>
        <StockOverlay status={product.stockStatus} stock={product.stock} />
      </div>

      <div className="mt-3.5 flex flex-1 flex-col gap-1.5 px-0.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-ink sm:text-[0.9375rem]">
          {product.name}
        </h3>
        <p className="meta-sm tracking-wide">{product.sku}</p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} showValue />
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="price-md leading-none">
              {formatPriceShort(product.price)}
            </p>
            {sarLabel && (
              <p className="mt-0.5 text-[10px] text-ink-muted">≈ {sarLabel}</p>
            )}
            {product.compareAtPrice && (
              <p className="mt-1 text-[11px] text-ink-light line-through">
                {formatPriceShort(product.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="أضيفي إلى السلة"
            onClick={onAdd}
            disabled={out}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white shadow-sm transition duration-250 hover:bg-henna hover:shadow-md active:scale-95 disabled:opacity-40"
          >
            <Plus className="h-5 w-5 sm:hidden" strokeWidth={2} />
            <ShoppingBag className="hidden h-[1.125rem] w-[1.125rem] sm:block" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </Link>
  );
}
