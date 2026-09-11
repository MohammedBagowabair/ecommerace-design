"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/types";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/Countdown";

export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-henna text-white shadow-soft sm:rounded-3xl">
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
      <div className="relative flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DiscountBadge percent={offer.discountPercent} size="md" />
            {offer.badge && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                {offer.badge}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-bold sm:text-2xl">{offer.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-white/80">{offer.description}</p>
          {offer.endsAt && (
            <div className="mt-3 sm:mt-4">
              <p className="mb-2 text-[11px] font-semibold text-gold-200">ينتهي خلال</p>
              <CountdownTimer endsAt={offer.endsAt} size="sm" />
            </div>
          )}
        </div>
        <Link
          href={offer.href ?? "/offers"}
          className="btn-primary min-h-12 w-full shrink-0 bg-white text-henna hover:bg-cream-50 sm:w-auto"
        >
          تسوّقي العروض
        </Link>
      </div>
    </div>
  );
}
