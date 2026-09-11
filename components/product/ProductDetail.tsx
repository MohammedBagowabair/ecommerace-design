"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ChevronRight,
  Heart,
  Share2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Product, Review } from "@/lib/types";
import {
  formatPrice,
  formatPriceShort,
  formatSarFromYer,
  getDiscountPercent,
  cn,
} from "@/lib/utils";
import { SafeMedia } from "@/components/media/SafeMedia";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { resolveDeliveryCopy } from "@/lib/delivery-settings";
import { isVideoSrc } from "@/lib/media/compress";
import { Badge, DiscountBadge } from "@/components/ui/Badge";
import { StockBadge } from "@/components/ui/StockBadge";
import { StarRating } from "@/components/ui/StarRating";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { ProductSection } from "./ProductSection";
import { ProductReviews } from "./ProductReviews";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import { useReviewsStore } from "@/lib/store/reviews";
import { useToastStore } from "@/lib/store/toast";
import { useUIStore } from "@/lib/store/ui";
import { getCategoryById } from "@/lib/data/categories";
import { getReviewDistribution } from "@/lib/data/reviews";

export function ProductDetail({
  product,
  reviews,
  similar,
  related,
  alsoNeed,
}: {
  product: Product;
  reviews: Review[];
  similar: Product[];
  related: Product[];
  alsoNeed: Product[];
}) {
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const addRecent = useRecentlyViewedStore((s) => s.add);
  const showToast = useToastStore((s) => s.show);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const wished = has(product.id);
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureOps = useAdminOpsStore((s) => s.ensureSeeded);
  useEffect(() => {
    ensureOps();
  }, [ensureOps]);
  const deliveryCopy = resolveDeliveryCopy(settings);
  const sarLabel = formatSarFromYer(product.price, settings.yerPerSar);
  const gallery = [
    ...(product.images ?? []),
    ...((product.videos ?? []).filter(Boolean)),
  ];
  const userReviews = useReviewsStore((s) => s.reviews);
  const allReviews = useMemo(() => {
    const userForProduct = userReviews.filter((r) => r.productId === product.id);
    const seedIds = new Set(reviews.map((r) => r.id));
    const extra = userForProduct.filter((r) => !seedIds.has(r.id));
    return [...extra, ...reviews] as Review[];
  }, [reviews, userReviews, product.id]);
  const displayDist = useMemo(() => getReviewDistribution(allReviews), [allReviews]);
  const headerRating = displayDist.total > 0 ? displayDist.average : product.rating;
  const headerCount = displayDist.total > 0 ? displayDist.total : product.reviewCount;
  const discount = getDiscountPercent(product.price, product.compareAtPrice);
  const out = product.stock <= 0;
  const cats = product.categoryIds
    .map((id) => getCategoryById(id))
    .filter(Boolean);

  useEffect(() => {
    addRecent(product.id);
    setImg(0);
  }, [product.id, addRecent]);

  const onAdd = () => {
    if (out) {
      showToast("نفدت الكمية من هذا المنتج", "error");
      return;
    }
    const ok = addItem(product.id, qty, product.stock);
    if (!ok) {
      showToast("لا يمكن إضافة المزيد من هذا المنتج", "error");
      return;
    }
    showToast(`تمت إضافة ${qty} × «${product.name}» إلى السلة`);
    openCart();
  };

  const onWish = () => {
    const added = toggle(product.id);
    showToast(added ? "أُضيفت إلى المفضلة" : "أُزيلت من المفضلة", "info");
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("تم نسخ الرابط", "info");
      }
    } catch {
      /* user cancelled */
    }
  };

  const lineTotal = product.price * qty;

  return (
    <div>
      <div className="container-pad py-3 text-sm text-ink-muted sm:py-4">
        <nav className="hidden flex-wrap items-center gap-1 sm:flex" aria-label="مسار التنقل">
          <Link href="/" className="transition hover:text-henna">
            الرئيسية
          </Link>
          <ChevronRight className="h-3.5 w-3.5 rotate-180 opacity-50" />
          <Link href="/products" className="transition hover:text-henna">
            النقشات
          </Link>
          {cats[0] && (
            <>
              <ChevronRight className="h-3.5 w-3.5 rotate-180 opacity-50" />
              <Link href={`/categories/${cats[0]!.slug}`} className="transition hover:text-henna">
                {cats[0]!.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5 rotate-180 opacity-50" />
          <span className="text-ink line-clamp-1">{product.name}</span>
        </nav>
        <Link
          href="/products"
          className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-henna sm:hidden"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          النقشات
        </Link>
      </div>

      <div className="container-pad pb-28 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl bg-cream-100 sm:rounded-2xl">
              <SafeMedia
                src={gallery[img] ?? product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
                controls={gallery[img] ? isVideoSrc(gallery[img]) : false}
                muted
                autoPlay={gallery[img] ? isVideoSrc(gallery[img]) : false}
                loop
              />
              <div className="absolute start-3 top-3 flex flex-col gap-1.5">
                {discount && <DiscountBadge percent={discount} size="md" />}
                {product.badges
                  .filter((b) => b !== "discount")
                  .map((b) => (
                    <Badge key={b} type={b} />
                  ))}
              </div>
              <div className="absolute end-3 top-3 flex gap-2">
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="مشاركة"
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-white/95 shadow-sm backdrop-blur transition hover:bg-white"
                >
                  <Share2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={onWish}
                  aria-label="مفضلة"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md bg-white/95 shadow-sm backdrop-blur transition hover:bg-white",
                    wished && "text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", wished && "fill-current")} strokeWidth={1.75} />
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImg(i)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-250",
                      i === img ? "w-6 bg-henna" : "w-2 bg-henna/25 hover:bg-henna/40"
                    )}
                    aria-label={`وسائط ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={src.slice(0, 40) + String(i)}
                  type="button"
                  onClick={() => setImg(i)}
                  className={cn(
                    "relative h-[4.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-lg border transition duration-200",
                    i === img ? "border-ink shadow-sm" : "border-cream-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <SafeMedia src={src} alt="" fill className="object-cover" sizes="72px" muted />
                </button>
              ))}
            </div>
          </div>

          {/* Info / purchase block */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1 text-start">
                <h1 className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
                  {product.name}
                </h1>
                <p className="meta-sm mt-1.5 tracking-wide">{product.sku}</p>
              </div>
              <div className="shrink-0 text-start sm:text-end">
                <p className="price-lg">{formatPriceShort(product.price)}</p>
                {sarLabel && (
                  <p className="mt-1 text-xs text-ink-muted">≈ {sarLabel}</p>
                )}
                {product.compareAtPrice && (
                  <p className="mt-0.5 text-sm text-ink-light line-through">
                    {formatPriceShort(product.compareAtPrice)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <StarRating
                rating={headerRating}
                size="md"
                showValue
                reviewCount={headerCount}
              />
            </div>

            <div className="mt-4">
              <StockBadge status={product.stockStatus} stock={product.stock} size="md" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink-muted sm:text-[15px] sm:leading-7">{product.description}</p>

            {product.info && (
              <dl className="mt-6 grid gap-3 rounded-lg border border-cream-200 bg-cream-100/80 p-4 text-sm sm:grid-cols-2 sm:p-5">
                {Object.entries(product.info).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-ink-light">{k}</dt>
                    <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Trust cues */}
            <div className="mt-6 space-y-2.5">
              <div className="trust-row">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-ink shadow-sm">
                  <Truck className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-semibold text-ink">{deliveryCopy.deliveryLabel}</p>
                  <p className="text-xs text-ink-muted">
                    {deliveryCopy.deliveryEta}
                    {deliveryCopy.pickupEnabled
                      ? ` · أو ${deliveryCopy.pickupLabel}`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="trust-row">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-ink shadow-sm">
                  <Building2 className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-semibold text-ink">الدفع بالتحويل البنكي</p>
                  <p className="text-xs text-ink-muted">آمن وواضح — تفاصيل الحساب عند إتمام الطلب</p>
                </div>
              </div>
            </div>

            {/* Desktop purchase block */}
            <div className="mt-8 hidden rounded-xl border border-cream-200 bg-white p-5 shadow-card lg:block">
              <div className="flex flex-wrap items-center gap-3">
                <QuantitySelector
                  value={qty}
                  onChange={setQty}
                  max={Math.max(1, product.stock || 1)}
                />
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={out}
                  className="btn-primary min-w-0 flex-1"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                  {out ? "نفدت الكمية" : "أضيفي إلى السلة"}
                </button>
                <button
                  type="button"
                  onClick={onWish}
                  aria-label="المفضلة"
                  className="btn-outline px-4"
                >
                  <Heart className={cn("h-4 w-4", wished && "fill-red-500 text-red-500")} strokeWidth={1.75} />
                </button>
              </div>
              {!out && (
                <p className="mt-3 text-xs text-ink-light">
                  الإجمالي:{" "}
                  <span className="font-semibold text-ink">{formatPrice(lineTotal)}</span>
                  {qty > 1 ? ` · ${qty} قطع` : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        <ProductReviews
          reviews={allReviews}
          productRating={product.rating}
          productReviewCount={product.reviewCount}
        />
      </div>

      <ProductSection
        title="نقشات مشابهة"
        subtitle="تصاميم قريبة من نوع ونقشة هذه القطعة"
        products={similar}
        href="/products"
        tone="cream"
      />
      <ProductSection
        title="منتجات مرتبطة"
        subtitle="نفس المناسبة أو الأسلوب"
        products={related}
        href="/products"
      />
      <ProductSection
        title="قد تحتاجين أيضًا"
        subtitle="مكملات وعروض تناسب اختياركِ"
        eyebrow="اقتراحات نقشات"
        products={alsoNeed}
        href="/offers"
        tone="blush"
      />
      <RecentlyViewed excludeId={product.id} />

      {/* Sticky mobile CTA — thumb-reachable */}
      <div className="sticky-cta-bar lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-2">
          <div className="min-w-0 shrink">
            <p className="price-md text-[15px] leading-tight">{formatPriceShort(lineTotal)}</p>
            {qty > 1 && (
              <p className="text-[10px] text-ink-light">{qty} قطع</p>
            )}
          </div>
          <QuantitySelector
            value={qty}
            onChange={setQty}
            max={Math.max(1, product.stock || 1)}
            size="sm"
            className="shrink-0"
          />
          <button
            type="button"
            onClick={onAdd}
            disabled={out}
            className="btn-primary min-h-11 min-w-0 flex-1 gap-1.5 rounded-md px-3 text-sm"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="truncate">{out ? "نفدت" : "أضيفي للسلة"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
