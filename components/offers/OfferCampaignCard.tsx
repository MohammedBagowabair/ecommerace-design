"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Offer } from "@/lib/types";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer, formatOfferEndDate } from "@/components/ui/Countdown";
import { cn } from "@/lib/utils";

export function OfferCampaignCard({
  offer,
  featured = false,
}: {
  offer: Offer;
  featured?: boolean;
}) {
  const href = offer.href ?? `/offers#${offer.id}`;

  return (
    <article
      id={offer.id}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-henna text-white shadow-soft",
        featured ? "min-h-[280px] sm:min-h-[320px]" : "min-h-[240px]"
      )}
    >
      {offer.image && (
        <Image
          src={offer.image}
          alt=""
          fill
          className="object-cover opacity-35 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
          sizes="(max-width:1024px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-henna-900/90 via-henna-800/55 to-henna/20" />
      <div className="relative flex h-full flex-col justify-between gap-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <DiscountBadge percent={offer.discountPercent} size="md" className="bg-red-600" />
          {offer.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold-200" />
              {offer.badge}
            </span>
          )}
        </div>

        <div>
          <h3 className={cn("font-bold leading-tight", featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
            {offer.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">{offer.description}</p>
          {offer.endsAt && (
            <p className="mt-3 text-xs font-medium text-gold-200">
              ينتهي في {formatOfferEndDate(offer.endsAt)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {offer.endsAt ? <CountdownTimer endsAt={offer.endsAt} size="md" /> : <span />}
          <Link
            href={href}
            className="btn-primary shrink-0 bg-white text-henna hover:bg-cream-50"
          >
            تسوّقي العرض
          </Link>
        </div>
      </div>
    </article>
  );
}
