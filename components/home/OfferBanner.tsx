"use client";

import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/types";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/Countdown";

export function OfferBanner({ offer }: { offer: Offer }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-henna text-white shadow-soft">
      {offer.image && (
        <Image
          src={offer.image}
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
      )}
      <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DiscountBadge percent={offer.discountPercent} size="md" />
            {offer.badge && (
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                {offer.badge}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-bold sm:text-2xl">{offer.title}</h3>
          <p className="mt-1 text-sm text-white/80">{offer.description}</p>
          {offer.endsAt && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold text-gold-200">ينتهي العرض خلال</p>
              <CountdownTimer endsAt={offer.endsAt} size="sm" />
            </div>
          )}
        </div>
        <Link
          href={offer.href ?? "/offers"}
          className="btn-primary shrink-0 bg-white text-henna hover:bg-cream-50"
        >
          تسوّقي العروض
        </Link>
      </div>
    </div>
  );
}
