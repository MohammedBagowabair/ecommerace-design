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
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cream-200/80 via-cream to-blush/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-16 top-24 h-64 w-64 rounded-full bg-gold-100/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-20 bottom-20 h-48 w-48 rounded-full bg-henna-100/40 blur-3xl"
      />

      <div className="relative mb-8 text-center sm:mb-10">
        <Link
          href="/"
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-henna font-display text-lg font-semibold text-cream-50 shadow-soft transition hover:bg-henna-700"
        >
          ن
        </Link>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
        )}
        <p className="mt-1.5 text-[11px] tracking-luxury text-ink-light">{brand.name}</p>
      </div>

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-cream-200/50 bg-[#FFFCFA]/95 p-6 shadow-float backdrop-blur-sm sm:p-8">
        {children}
      </div>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-6 flex items-center gap-3" aria-hidden>
      <div className="h-px flex-1 bg-cream-200" />
      <span className="text-[11px] font-medium tracking-luxury text-ink-light">أو</span>
      <div className="h-px flex-1 bg-cream-200" />
    </div>
  );
}
