"use client";

import Link from "next/link";
import { announcementMessages } from "@/lib/data";

export function AnnouncementBar() {
  const doubled = [...announcementMessages, ...announcementMessages];

  return (
    <div className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-8 bg-gradient-to-l from-transparent to-ink sm:w-12" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-8 bg-gradient-to-r from-transparent to-ink sm:w-12" />
      <div className="flex items-stretch">
        <Link
          href="/offers"
          className="relative z-20 hidden shrink-0 items-center gap-2 bg-rose-500 px-3.5 py-2 text-[10px] font-bold uppercase tracking-luxury text-white sm:inline-flex"
        >
          عروض
        </Link>
        <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-[11px] font-medium tracking-wide text-white/80 sm:py-2 sm:text-[12px]">
          {doubled.map((msg, i) => (
            <span key={`${msg}-${i}`} className="mx-5 inline-flex items-center gap-5 sm:mx-7 sm:gap-7">
              <span>{msg}</span>
              <span className="text-rose-400" aria-hidden>
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
