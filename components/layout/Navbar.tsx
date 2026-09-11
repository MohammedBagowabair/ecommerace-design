"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { brand, navLinks } from "@/lib/data";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useUIStore } from "@/lib/store/ui";
import {
  ensureCustomerAuthHydrated,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.ids.length);
  const openCart = useUIStore((s) => s.openCartDrawer);
  const openSearch = useUIStore((s) => s.openSearchOverlay);
  const session = useCustomerAuthStore((s) => s.session);
  const logout = useCustomerAuthStore((s) => s.logout);
  const showToast = useToastStore((s) => s.show);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(cartCount);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    setMounted(true);
    ensureCustomerAuthHydrated();
  }, []);
  useEffect(() => {
    setOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [accountMenuOpen]);

  function handleLogout() {
    logout();
    setAccountMenuOpen(false);
    setOpen(false);
    showToast("تم تسجيل الخروج", "info");
  }

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
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
    <>
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-white">
      <div className="container-pad">
        {/* Desktop — sleek black/white commercial bar */}
        <div className="hidden items-center gap-5 py-3 lg:flex">
          <Link href="/" className="shrink-0 font-display text-xl font-bold tracking-tight text-ink transition hover:opacity-80">
            {brand.name}
          </Link>

          <nav className="flex items-center gap-0" aria-label="التنقل الرئيسي">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative px-3.5 py-2 text-[13px] font-semibold transition duration-200",
                  pathname === l.href
                    ? "text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-ink"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={openSearch}
            className="relative mx-auto flex max-w-sm flex-1 items-center gap-2.5 rounded-md border border-cream-300 bg-cream-100 px-3.5 py-2 text-sm text-ink-light transition duration-200 hover:border-cream-300 hover:bg-white"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="flex-1 text-start">ابحثي عن نقشات...</span>
            <kbd className="hidden rounded border border-cream-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-light sm:inline">
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
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                aria-label="حسابي"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="relative flex h-10 w-10 items-center justify-center rounded-md text-ink transition duration-200 hover:bg-cream-100"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
                {mounted && session && (
                  <span className="absolute bottom-1 end-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute end-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-lg border border-cream-200 bg-white py-1 shadow-float"
                >
                  {mounted && session ? (
                    <>
                      <div className="border-b border-cream-100 px-3.5 py-2.5">
                        <p className="truncate text-sm font-bold text-ink">{session.name}</p>
                        <p className="truncate text-[11px] text-ink-muted">
                          {session.email || session.phone}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-100"
                      >
                        <User className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        حسابي
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-100"
                      >
                        <LogOut className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-100"
                      >
                        <LogIn className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/register"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-100"
                      >
                        <UserPlus className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        إنشاء حساب
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile — Shein-like dense bar */}
        <div className="flex items-center gap-1 py-2 lg:hidden">
          <Link href="/" className="shrink-0 font-display text-base font-bold text-ink sm:text-lg">
            {brand.name}
          </Link>
          <button
            type="button"
            onClick={openSearch}
            className="relative mx-0.5 flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-cream-300 bg-cream-100 px-2.5 py-1.5 text-xs text-ink-light"
          >
            <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="truncate">ابحثي...</span>
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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink transition hover:bg-cream-100"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>

      {mounted &&
        createPortal(
          <div
        className={cn(
          "fixed inset-0 z-[100] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="إغلاق القائمة"
          className={cn(
            "absolute inset-0 bg-ink/50 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        {/* RTL start = right: drawer from right */}
        <aside
          className={cn(
            "absolute inset-y-0 start-0 flex w-[min(18.5rem,86vw)] flex-col bg-white shadow-float transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
        >
          <div className="flex items-center justify-between border-b border-cream-200 px-4 py-3">
            <Link
              href="/"
              className="font-display text-base font-bold text-ink"
              onClick={() => setOpen(false)}
            >
              {brand.name}
            </Link>
            <button
              type="button"
              aria-label="إغلاق القائمة"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-cream-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-2 safe-bottom" aria-label="القائمة الرئيسية">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3.5 py-3 text-[14px] font-semibold transition",
                    pathname === l.href
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-cream-100"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="my-2 border-t border-cream-100" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSearch();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3.5 py-3 text-start text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              البحث
            </button>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3.5 py-3 text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <span className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                المفضلة
              </span>
              {mounted && wishCount > 0 && (
                <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-md px-3.5 py-3 text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <span className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                السلة
              </span>
              {mounted && cartCount > 0 && (
                <span className="rounded bg-ink px-2 py-0.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {mounted && session ? (
              <>
                <div className="mx-1 mt-1 rounded-md bg-cream-100 px-3.5 py-2.5">
                  <p className="truncate text-sm font-bold text-ink">{session.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {session.email || session.phone}
                  </p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3.5 py-3 text-sm font-semibold text-ink hover:bg-cream-100"
                >
                  <User className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  حسابي
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3.5 py-3 text-start text-sm font-semibold text-ink hover:bg-cream-100"
                >
                  <LogOut className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3.5 py-3 text-sm font-semibold text-ink hover:bg-cream-100"
                >
                  <LogIn className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mx-1 mt-1 flex items-center justify-center gap-2 rounded-md bg-ink px-3.5 py-3 text-sm font-semibold text-white hover:bg-henna-700"
                >
                  <UserPlus className="h-4 w-4" strokeWidth={1.75} />
                  إنشاء حساب
                </Link>
              </>
            )}
          </nav>
        </aside>
      </div>,
          document.body
        )}
    </>
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
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-ink transition duration-200 hover:bg-cream-100"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
      {count > 0 && (
        <span
          className={cn(
            "absolute -top-0.5 -end-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white",
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
      className="relative flex h-10 w-10 items-center justify-center rounded-md text-ink transition duration-200 hover:bg-cream-100"
    >
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -end-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
