"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/types";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/Countdown";

export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-henna-800 text-cream-50 shadow-soft sm:rounded-[2rem]">
      {offer.image && (
        <Image
          src={offer.image}
          alt=""
          fill
          loading="lazy"
          className="object-cover opacity-25"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-l from-henna-900/40 to-transparent" />
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-9">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DiscountBadge percent={offer.discountPercent} size="md" />
            {offer.badge && (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide backdrop-blur">
                {offer.badge}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-display text-lg font-semibold sm:text-2xl">{offer.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-cream-100/70">{offer.description}</p>
          {offer.endsAt && (
            <div className="mt-4 sm:mt-5">
              <p className="mb-2 text-[10px] font-medium tracking-luxury-wide text-gold-300">ينتهي خلال</p>
              <CountdownTimer endsAt={offer.endsAt} size="sm" />
            </div>
          )}
        </div>
        <Link
          href={offer.href ?? "/offers"}
          className="btn-primary min-h-12 w-full shrink-0 bg-cream-50 text-henna hover:bg-white sm:w-auto"
        >
          تسوّقي العروض
        </Link>
      </div>
    </div>
  );
}
