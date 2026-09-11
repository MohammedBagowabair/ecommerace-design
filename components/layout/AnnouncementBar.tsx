"use client";

import Link from "next/link";
import { announcementMessages } from "@/lib/data";

export function AnnouncementBar() {
  const doubled = [...announcementMessages, ...announcementMessages];

  return (
    <div className="relative overflow-hidden bg-gradient-to-l from-ink via-henna-800 to-ink text-white">
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-l from-transparent to-ink/80" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-r from-transparent to-ink/80" />
      <div className="flex items-stretch">
        <Link
          href="/offers"
          className="relative z-20 hidden shrink-0 items-center gap-2 bg-gold px-4 py-2 text-[11px] font-bold text-ink sm:inline-flex"
        >
          <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-red-600" />
          عروض محدودة
        </Link>
        <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-xs font-medium tracking-wide sm:text-[13px]">
          {doubled.map((msg, i) => (
            <span key={`${msg}-${i}`} className="mx-6 inline-flex items-center gap-6">
              <span>{msg}</span>
              <span className="text-gold-400" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
