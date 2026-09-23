"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/types";
import { getOfferHref } from "@/lib/data/offers";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/Countdown";

export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-ink text-white sm:rounded-2xl">
      {offer.image && (
        <Image
          src={offer.image}
          alt=""
          fill
          loading="lazy"
          className="object-cover opacity-30"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
      <div className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DiscountBadge percent={offer.discountPercent} size="md" />
            {offer.badge && (
              <span className="rounded border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide backdrop-blur">
                {offer.badge}
              </span>
            )}
          </div>
          <h3 className="mt-3 font-display text-lg font-bold sm:text-2xl">{offer.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/65">{offer.description}</p>
          {offer.endsAt && (
            <div className="mt-4 sm:mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-luxury-wide text-rose-300">ينتهي خلال</p>
              <CountdownTimer endsAt={offer.endsAt} size="sm" />
            </div>
          )}
        </div>
        <Link
          href={getOfferHref(offer.id)}
          className="btn-primary min-h-11 w-full shrink-0 bg-white text-ink hover:bg-cream-100 sm:w-auto"
        >
          تسوّقي العرض
        </Link>
      </div>
    </div>
  );
}
