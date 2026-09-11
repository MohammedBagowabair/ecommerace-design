"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { brand, navLinks } from "@/lib/data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.ids.length);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const openSearch = useUIStore((s) => s.openSearchOverlay);
  const prevCount = useRef(cartCount);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (mounted && cartCount > prevCount.current) {
      setBadgeBump(true);
      const t = setTimeout(() => setBadgeBump(false), 400);
      prevCount.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount, mounted]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200/70 bg-white/90 backdrop-blur-md">
      <div className="container-pad">
        {/* Desktop */}
        <div className="hidden items-center gap-6 py-3.5 lg:flex">
          <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-henna transition hover:opacity-90">
            {brand.name}
          </Link>

          <nav className="flex items-center gap-0.5" aria-label="التنقل الرئيسي">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3.5 py-2.5 text-sm font-semibold transition duration-250",
                  pathname === l.href
                    ? "bg-henna-50 text-henna"
                    : "text-ink-muted hover:bg-cream-100 hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={openSearch}
            className="relative mx-auto flex max-w-md flex-1 items-center gap-2.5 rounded-full border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm text-ink-light transition duration-250 hover:border-henna-200 hover:bg-white hover:shadow-sm"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-start">ابحثي عن نقشات أو منتجات...</span>
            <kbd className="hidden rounded-lg border border-cream-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-light sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-0.5">
            <IconLink href="/wishlist" label="مفضلة" count={mounted ? wishCount : 0}>
              <Heart className="h-5 w-5" strokeWidth={1.75} />
            </IconLink>
            <CartIconButton
              count={mounted ? cartCount : 0}
              onClick={openCart}
              bump={badgeBump}
            />
            <IconLink href="/account" label="حسابي" count={0}>
              <User className="h-5 w-5" strokeWidth={1.75} />
            </IconLink>
          </div>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1.5 py-3 lg:hidden">
          <Link href="/" className="shrink-0 text-xl font-bold text-henna">
            {brand.name}
          </Link>
          <button
            type="button"
            onClick={openSearch}
            className="relative mx-1 flex min-h-11 flex-1 items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-3.5 py-2 text-xs text-ink-light"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>ابحثي...</span>
          </button>
          <CartIconButton
            count={mounted ? cartCount : 0}
            onClick={openCart}
            bump={badgeBump}
          />
          <button
            type="button"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-cream-100"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[min(75vh,32rem)] overflow-y-auto border-t border-cream-200 bg-white lg:hidden animate-fadeIn">
          <nav className="container-pad flex flex-col gap-1 py-4" aria-label="القائمة الرئيسية">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-2xl px-4 py-3.5 text-sm font-semibold transition",
                  pathname === l.href
                    ? "bg-henna-50 text-henna"
                    : "text-ink hover:bg-cream-100"
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 border-t border-cream-100" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSearch();
              }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-start text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              البحث
            </button>
            <Link
              href="/wishlist"
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <span className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                المفضلة
              </span>
              {mounted && wishCount > 0 && (
                <span className="rounded-full bg-henna-50 px-2 py-0.5 text-xs font-bold text-henna">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                السلة
              </span>
              {mounted && cartCount > 0 && (
                <span className="rounded-full bg-henna-50 px-2 py-0.5 text-xs font-bold text-henna">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <User className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              حسابي
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIconButton({
  count,
  onClick,
  bump,
}: {
  count: number;
  onClick: () => void;
  bump?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={count > 0 ? `سلة التسوق، ${count} منتجات` : "سلة التسوق"}
      onClick={onClick}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition duration-250 hover:bg-cream-100 hover:text-ink"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -end-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-henna px-1 text-[10px] font-bold text-white shadow-sm",
            bump && "animate-badgePop"
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition duration-250 hover:bg-cream-100 hover:text-ink"
    >
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-henna px-1 text-[10px] font-bold text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
