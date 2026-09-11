"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { getProductById } from "@/lib/data/products";
import { formatPriceShort } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToastStore } from "@/lib/store/toast";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear } = useCartStore();
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const rows = items
    .map((i) => {
      const product = getProductById(i.productId);
      return product ? { ...i, product } : null;
    })
    .filter(Boolean) as {
    productId: string;
    quantity: number;
    product: NonNullable<ReturnType<typeof getProductById>>;
  }[];

  const available = rows.filter(
    (r) => r.product.stock > 0 && r.product.stockStatus !== "out_of_stock"
  );
  const unavailable = rows.filter(
    (r) => r.product.stock <= 0 || r.product.stockStatus === "out_of_stock"
  );

  const subtotal = available.reduce((s, r) => s + r.product.price * r.quantity, 0);
  const compareSubtotal = available.reduce((s, r) => {
    const unit =
      r.product.compareAtPrice && r.product.compareAtPrice > r.product.price
        ? r.product.compareAtPrice
        : r.product.price;
    return s + unit * r.quantity;
  }, 0);
  const savings = compareSubtotal - subtotal;
  const itemCount = available.reduce((n, r) => n + r.quantity, 0);

  return (
    <div className="container-pad py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">السلة</h1>
          <p className="page-subtitle">
            {rows.length
              ? `${itemCount} منتج متاح للإتمام${unavailable.length ? ` · ${unavailable.length} غير متوفر` : ""}`
              : "راجعِ مشترياتك قبل إتمام الطلب"}
          </p>
        </div>
        {rows.length > 0 && (
          <button
            type="button"
            className="text-sm font-semibold text-ink-light underline-offset-2 hover:text-red-600 hover:underline"
            onClick={() => setConfirmClear(true)}
          >
            تفريغ السلة
          </button>
        )}
      </div>

      {!rows.length ? (
        <div className="mt-8">
          <EmptyState
            icon="cart"
            title="سلتك فارغة"
            description="اكتشفي أجمل نقشات الحناء وأضيفي ما يعجبك إلى سلتك."
            actionLabel="تصفحي النقشات"
            actionHref="/products"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {available.map(({ product, quantity, productId }) => (
              <CartLineItem
                key={productId}
                product={product}
                quantity={quantity}
                onQuantityChange={(v) => updateQuantity(productId, v, product.stock)}
                onRemove={() => {
                  removeItem(productId);
                  showToast("أُزيل المنتج من السلة", "info");
                }}
              />
            ))}

            {unavailable.length > 0 && (
              <div className="pt-2">
                <h2 className="mb-3 text-sm font-bold text-red-700">
                  منتجات غير متوفرة
                </h2>
                <div className="space-y-3">
                  {unavailable.map(({ product, quantity, productId }) => (
                    <CartLineItem
                      key={productId}
                      product={product}
                      quantity={quantity}
                      onQuantityChange={() => undefined}
                      onRemove={() => {
                        removeItem(productId);
                        showToast("أُزيل المنتج من السلة", "info");
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl bg-white p-5 shadow-card lg:sticky lg:top-24">
            <h2 className="font-bold text-ink">ملخص الطلب</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">عدد المنتجات</dt>
                <dd className="font-semibold text-ink">{itemCount}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">قبل الخصم</dt>
                  <dd className="text-ink-light line-through">
                    {formatPriceShort(compareSubtotal)}
                  </dd>
                </div>
              )}
              {savings > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">قيمة الخصم</dt>
                  <dd className="font-semibold text-emerald-700">
                    −{formatPriceShort(savings)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-3 border-t border-cream-200 pt-3">
                <dt className="font-bold text-ink">المجموع</dt>
                <dd className="text-lg font-bold text-henna">
                  {formatPriceShort(subtotal)}
                </dd>
              </div>
            </dl>

            {unavailable.length > 0 && (
              <p className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-xs text-red-700">
                المنتجات غير المتوفرة لن تُدرج في الطلب. أزيليها أو انتظري عودتها.
              </p>
            )}

            <p className="mt-3 text-xs text-ink-light">
              التوصيل والدفع بالتحويل البنكي — تفاصيل الدفع في الخطوة التالية.
            </p>

            <Link
              href="/checkout"
              className={`btn-primary mt-5 w-full ${
                available.length === 0 ? "pointer-events-none opacity-50" : ""
              }`}
            >
              المتابعة لإتمام الشراء
            </Link>
            <Link href="/products" className="btn-outline mt-3 w-full">
              متابعة التسوق
            </Link>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="تفريغ السلة؟"
        description="سيتم حذف جميع المنتجات من سلتك. يمكنكِ دائمًا إضافتها مرة أخرى."
        confirmLabel="نعم، فرّغي السلة"
        cancelLabel="إبقاء السلة"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clear();
          setConfirmClear(false);
          showToast("تم تفريغ السلة", "info");
        }}
      />
    </div>
  );
}
