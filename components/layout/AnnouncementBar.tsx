"use client";

import Link from "next/link";
import { announcementMessages } from "@/lib/data";

export function AnnouncementBar() {
  const doubled = [...announcementMessages, ...announcementMessages];

  return (
    <div className="relative overflow-hidden bg-henna-900 text-cream-100">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-l from-transparent to-henna-900/90 sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10 bg-gradient-to-r from-transparent to-henna-900/90 sm:w-16" />
      <div className="flex items-stretch">
        <Link
          href="/offers"
          className="relative z-20 hidden shrink-0 items-center gap-2 bg-gold-500/90 px-4 py-2 text-[10px] font-semibold tracking-luxury text-henna-900 sm:inline-flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-henna-800" />
          عروض محدودة
        </Link>
        <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-[11px] font-medium tracking-wide text-cream-100/85 sm:py-2.5 sm:text-[12px]">
          {doubled.map((msg, i) => (
            <span key={`${msg}-${i}`} className="mx-5 inline-flex items-center gap-5 sm:mx-7 sm:gap-7">
              <span>{msg}</span>
              <span className="text-gold-400/70" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
