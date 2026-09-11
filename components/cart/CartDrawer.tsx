"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { useCartStore } from "@/lib/store/cart";
import { useToastStore } from "@/lib/store/toast";
import { getProductById } from "@/lib/data/products";
import { formatPriceShort, cn } from "@/lib/utils";
import { CartLineItem } from "./CartLineItem";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const { items, updateQuantity, removeItem } = useCartStore();
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!mounted) return null;

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
  const subtotal = available.reduce((s, r) => s + r.product.price * r.quantity, 0);
  const compareSubtotal = available.reduce((s, r) => {
    const unit = r.product.compareAtPrice && r.product.compareAtPrice > r.product.price
      ? r.product.compareAtPrice
      : r.product.price;
    return s + unit * r.quantity;
  }, 0);
  const savings = compareSubtotal - subtotal;
  const count = available.reduce((n, r) => n + r.quantity, 0);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80]",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="إغلاق السلة"
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={close}
      />

      {/* Panel — RTL-aware: docks to logical end (left in Arabic RTL) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="سلة التسوق"
        className={cn(
          "absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-cream-50 shadow-float transition-transform duration-300 ease-out",
          "ltr:translate-x-full rtl:-translate-x-full",
          open && "!translate-x-0"
        )}
      >
        <header className="flex items-center justify-between border-b border-cream-200 bg-white px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-henna" />
            <h2 className="text-lg font-bold text-ink">سلتك</h2>
            {count > 0 && (
              <span className="rounded-full bg-henna-50 px-2 py-0.5 text-xs font-bold text-henna">
                {count}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={close}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-100 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!rows.length ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cream-100 to-blush/50 text-henna shadow-sm ring-1 ring-cream-200">
                <ShoppingBag className="h-8 w-8" strokeWidth={1.4} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-ink">سلتك فارغة</h3>
              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-ink-muted">
                اكتشفي أجمل نقشات الحناء وأضيفي ما يعجبكِ — سلة أنيقة بانتظار اختياركِ.
              </p>
              <Link
                href="/products"
                onClick={close}
                className="btn-primary mt-7 min-w-[10rem]"
              >
                تصفحي النقشات
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {rows.map(({ product, quantity, productId }) => (
                <li key={productId}>
                  <CartLineItem
                    product={product}
                    quantity={quantity}
                    compact
                    onQuantityChange={(v) =>
                      updateQuantity(productId, v, product.stock)
                    }
                    onRemove={() => {
                      removeItem(productId);
                      showToast("أُزيل المنتج من السلة", "info");
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {rows.length > 0 && (
          <footer className="border-t border-cream-200 bg-white px-4 py-4 safe-bottom">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-muted">المجموع الفرعي</span>
              <span className="text-lg font-bold text-henna">
                {formatPriceShort(subtotal)}
              </span>
            </div>
            {savings > 0 && (
              <p className="mt-1 text-xs font-semibold text-emerald-700">
                وفّرتِ {formatPriceShort(savings)}
              </p>
            )}
            {available.length < rows.length && (
              <p className="mt-2 text-xs text-red-600">
                بعض المنتجات غير متوفرة ولن تُحسب في المجموع.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={close}
                className={cn(
                  "btn-primary w-full",
                  available.length === 0 && "pointer-events-none opacity-50"
                )}
              >
                إتمام الشراء
              </Link>
              <Link href="/cart" onClick={close} className="btn-outline w-full">
                عرض السلة كاملة
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
