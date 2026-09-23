import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { OfferCard } from "@/components/offers/OfferCard";
import { DiscountBadge } from "@/components/ui/Badge";
import { CountdownTimer } from "@/components/ui/Countdown";
import { formatOfferEndDate } from "@/lib/utils";
import {
  offers,
  getOfferById,
  getOfferHref,
  getProductById,
} from "@/lib/data";

export function generateStaticParams() {
  return offers.map((offer) => ({ id: offer.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const offer = getOfferById(params.id);
  if (!offer) return { title: "عرض غير موجود" };
  return {
    title: offer.title,
    description: offer.description,
  };
}

export default function OfferDetailPage({ params }: { params: { id: string } }) {
  const offer = getOfferById(params.id);
  if (!offer) notFound();

  const products = offer.productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> =>
      Boolean(product && !product.isStub)
    );

  const others = offers.filter((item) => item.id !== offer.id);

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden bg-henna text-white">
        {offer.image && (
          <Image
            src={offer.image}
            alt=""
            fill
            priority
            className="object-cover opacity-35"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-henna-900/95 via-henna-800/70 to-henna/25" />
        <div className="relative container-pad py-8 sm:py-14">
          <Link
            href="/offers"
            className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold text-white/85 transition hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            كل العروض
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <DiscountBadge percent={offer.discountPercent} size="md" className="bg-red-600" />
            {offer.badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold backdrop-blur">
                <Sparkles className="h-3 w-3 text-gold-200" />
                {offer.badge}
              </span>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            {offer.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            {offer.description}
          </p>
          {offer.endsAt && (
            <p className="mt-4 text-sm font-medium text-gold-200">
              ينتهي في {formatOfferEndDate(offer.endsAt)}
            </p>
          )}
          {offer.endsAt && (
            <div className="mt-5 inline-flex rounded-2xl bg-white/95 p-3 shadow-card">
              <CountdownTimer endsAt={offer.endsAt} size="lg" />
            </div>
          )}
        </div>
      </section>

      <section className="container-pad py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="section-title">منتجات هذا العرض</h2>
            <p className="mt-1 text-sm text-ink-muted">
              خصم {offer.discountPercent}% على النقشات المشمولة في «{offer.title}»
            </p>
          </div>
          <p className="text-sm font-semibold text-henna">{products.length} منتجًا</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-card">
            <p className="font-semibold text-ink">لا توجد منتجات مرتبطة بهذا العرض حاليًا</p>
            <Link href="/products" className="btn-outline mt-4 inline-flex">
              تصفّحي النقشات
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <OfferCard
                key={product.id}
                product={product}
                endsAt={offer.endsAt}
                offerTitle={offer.title}
              />
            ))}
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section className="container-pad pb-4">
          <h2 className="section-title">حملات أخرى</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((item) => (
              <Link
                key={item.id}
                href={getOfferHref(item.id)}
                className="card-soft flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="font-bold text-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">خصم {item.discountPercent}%</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-henna">تسوّقي</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
