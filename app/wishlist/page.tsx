"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { useToastStore } from "@/lib/store/toast";
import { getProductById } from "@/lib/data/products";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriceDisplay } from "@/components/cart/PriceDisplay";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { StockOverlay } from "@/components/ui/StockBadge";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container-pad py-6 sm:py-8">
      <h1 className="page-title">المفضلة</h1>
      <p className="page-subtitle">
        {products.length
          ? `${products.length} نقشة محفوظة`
          : "احفظي نقشاتك المفضلة هنا للعودة إليها لاحقًا"}
      </p>

      <div className="mt-6">
        {!products.length ? (
          <EmptyState
            icon="wishlist"
            title="قائمة المفضلة فارغة"
            description="اضغطي على قلب أي نقشة لحفظها هنا، ثم أضيفيها إلى سلتك متى شئتِ."
            actionLabel="اكتشفي النقشات"
            actionHref="/products"
          />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const out =
                product.stockStatus === "out_of_stock" || product.stock <= 0;
              return (
                <li
                  key={product.id}
                  className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative aspect-[4/3] bg-cream-100"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className={cn("object-cover", out && "opacity-60 grayscale")}
                      sizes="(max-width:640px) 100vw, 33vw"
                    />
                    <StockOverlay status={product.stockStatus} stock={product.stock} />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 font-bold text-ink hover:text-henna"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        aria-label="إزالة من المفضلة"
                        className="shrink-0 rounded-full p-2 text-red-500 transition hover:bg-red-50"
                        onClick={() => {
                          remove(product.id);
                          showToast("أُزيلت من المفضلة", "info");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <StarRating
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      showValue
                    />
                    <PriceDisplay
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      size="md"
                    />
                    <div className="mt-auto flex gap-2 pt-2">
                      <button
                        type="button"
                        disabled={out}
                        className="btn-primary min-w-0 flex-1 py-2.5 text-xs sm:text-sm"
                        onClick={() => {
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
                        }}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        {out ? "غير متوفر" : "أضيفي إلى السلة"}
                      </button>
                      <Link
                        href={`/products/${product.slug}`}
                        className="btn-outline px-3 py-2.5"
                        aria-label="عرض المنتج"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
