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
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-cream-100 px-4 py-10 sm:py-14">
      <div className="relative mb-7 text-center sm:mb-8">
        <Link
          href="/"
          className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-ink font-display text-lg font-bold text-white transition hover:bg-henna-700"
        >
          ن
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
        )}
        <p className="mt-1.5 text-[11px] font-medium tracking-wide text-ink-light">{brand.name}</p>
      </div>

      <div className="relative w-full max-w-md rounded-xl border border-cream-200 bg-white p-6 shadow-card sm:p-8">
        {children}
      </div>
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5 flex items-center gap-3" aria-hidden>
      <div className="h-px flex-1 bg-cream-200" />
      <span className="text-[11px] font-semibold tracking-wide text-ink-light">أو</span>
      <div className="h-px flex-1 bg-cream-200" />
    </div>
  );
}
