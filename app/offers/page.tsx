import type { Metadata } from "next";
import Link from "next/link";
import { OfferCampaignCard } from "@/components/offers/OfferCampaignCard";
import { OfferCard } from "@/components/offers/OfferCard";
import {
  offers,
  getOfferProducts,
  getProductById,
  getOfferEndsAtForProduct,
  getOfferTitleForProduct,
  defaultOfferEndsAt,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "العروض",
  description: "عروض نقشات الحناء للعروس والمناسبات — خصومات لفترة محدودة",
};

export default function OffersPage() {
  const offerProducts = getOfferProducts();

  /** Prefer campaign-linked products, then remaining discounted items */
  const campaignProductIds = new Set(offers.flatMap((o) => o.productIds));
  const fromCampaigns = offers
    .flatMap((o) =>
      o.productIds
        .map((id) => getProductById(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p && !p.isStub))
        .map((p) => ({
          product: p,
          endsAt: o.endsAt ?? defaultOfferEndsAt,
          offerTitle: o.title,
        }))
    )
    .filter(
      (row, idx, arr) =>
        arr.findIndex((r) => r.product.id === row.product.id) === idx
    );

  const extras = offerProducts
    .filter((p) => !campaignProductIds.has(p.id))
    .map((p) => ({
      product: p,
      endsAt: getOfferEndsAtForProduct(p.id) ?? defaultOfferEndsAt,
      offerTitle: getOfferTitleForProduct(p.id),
    }));

  const cards = [...fromCampaigns, ...extras];

  return (
    <div className="pb-12">
      {/* Marketing hero */}
      <section className="border-b border-cream-300/80 bg-gradient-to-l from-blush via-cream to-gold-50">
        <div className="container-pad py-10 sm:py-14">
          <p className="text-xs font-semibold tracking-wide text-gold-600">عروض محدودة الوقت</p>
          <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">عروض خاصة لكِ</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            خصومات على نقشات العروس والزفاف والخطوبة والأعياد — تصفّحي الحملات أدناه واحصلي على
            أفضل الأسعار قبل انتهاء العدّاد.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#offer-products" className="btn-primary">
              شاهدي المنتجات المخفّضة
            </Link>
            <Link href="/categories/al-arous" className="btn-outline">
              مجموعة العروس
            </Link>
          </div>
        </div>
      </section>

      {/* Campaign cards */}
      <section className="container-pad py-8 sm:py-10">
        <div className="mb-6">
          <h2 className="section-title">حملات العروض</h2>
          <p className="mt-1 text-sm text-ink-muted">
            كل حملة تتضمن خصمًا واضحًا وتاريخ انتهاء وعدّادًا حيًا
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {offers.map((o, i) => (
            <OfferCampaignCard key={o.id} offer={o} featured={i === 0} />
          ))}
        </div>
      </section>

      {/* Product offer cards */}
      <section id="offer-products" className="bg-blush/30 py-8 sm:py-10">
        <div className="container-pad">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title">منتجات عليها خصم</h2>
              <p className="mt-1 text-sm text-ink-muted">
                صورة · الاسم · السعر القديم · السعر الجديد · نسبة الخصم · تاريخ الانتهاء · العدّاد
              </p>
            </div>
            <p className="text-sm font-semibold text-henna">{cards.length} عرضًا متاحًا</p>
          </div>

          {cards.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <p className="font-semibold text-ink">لا توجد عروض حاليًا</p>
              <Link href="/products" className="btn-outline mt-4 inline-flex">
                تصفّحي النقشات
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ product, endsAt, offerTitle }) => (
                <OfferCard
                  key={product.id}
                  product={product}
                  endsAt={endsAt}
                  offerTitle={offerTitle}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
