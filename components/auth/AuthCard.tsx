"use client";

import Link from "next/link";
import { brand } from "@/lib/data";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-henna-100/70 via-cream to-blush/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-20 top-16 h-56 w-56 rounded-full bg-gold-100/40 blur-3xl"
      />

      <div className="relative mb-6 text-center sm:mb-8">
        <Link
          href="/"
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-henna text-lg font-bold text-white shadow-soft transition hover:opacity-90"
        >
          ن
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
        )}
        <p className="mt-1 text-xs text-ink-light">{brand.name}</p>
      </div>

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-cream-200/80 bg-white/95 p-5 shadow-float backdrop-blur sm:p-7">
        {children}
      </div>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5 flex items-center gap-3" aria-hidden>
      <div className="h-px flex-1 bg-cream-200" />
      <span className="text-xs font-semibold text-ink-light">أو</span>
      <div className="h-px flex-1 bg-cream-200" />
    </div>
  );
}
