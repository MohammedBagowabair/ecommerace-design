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
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                aria-label="حسابي"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition duration-250 hover:bg-cream-100 hover:text-ink"
              >
                <User className="h-5 w-5" strokeWidth={1.75} />
                {mounted && session && (
                  <span className="absolute bottom-1 end-1 h-2 w-2 rounded-full bg-henna ring-2 ring-white" />
                )}
              </button>
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute end-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-cream-200 bg-white py-1.5 shadow-float"
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
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-50"
                      >
                        <User className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        حسابي
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-50"
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
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-50"
                      >
                        <LogIn className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/register"
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-semibold text-ink hover:bg-cream-50"
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

        {/* Mobile — one-hand friendly: brand + search + cart + menu */}
        <div className="flex items-center gap-1 py-2.5 lg:hidden">
          <Link href="/" className="shrink-0 text-lg font-bold text-henna sm:text-xl">
            {brand.name}
          </Link>
          <button
            type="button"
            onClick={openSearch}
            className="relative mx-0.5 flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-3 py-2 text-xs text-ink-light"
          >
            <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-cream-100"
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
            "absolute inset-0 bg-ink/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 start-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
        >
          <div className="flex h-14 items-center justify-between border-b border-cream-200 px-4">
            <Link
              href="/"
              className="text-lg font-bold text-henna"
              onClick={() => setOpen(false)}
            >
              {brand.name}
            </Link>
            <button
              type="button"
              aria-label="إغلاق القائمة"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-cream-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-3 safe-bottom" aria-label="القائمة الرئيسية">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition",
                    pathname === l.href
                      ? "bg-henna-50 text-henna"
                      : "text-ink hover:bg-cream-100"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="my-3 border-t border-cream-100" />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSearch();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start text-sm font-semibold text-ink hover:bg-cream-100"
            >
              <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
              البحث
            </button>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
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
            {mounted && session ? (
              <>
                <div className="rounded-2xl bg-cream-50 px-4 py-3">
                  <p className="truncate text-sm font-bold text-ink">{session.name}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {session.email || session.phone}
                  </p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink hover:bg-cream-100"
                >
                  <User className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  حسابي
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start text-sm font-semibold text-ink hover:bg-cream-100"
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
                  className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-ink hover:bg-cream-100"
                >
                  <LogIn className="h-4 w-4 text-ink-muted" strokeWidth={1.75} />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl bg-henna-50 px-4 py-3.5 text-sm font-bold text-henna hover:bg-henna-100"
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
