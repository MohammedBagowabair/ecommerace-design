import { Hero } from "@/components/home/Hero";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { OfferBanner } from "@/components/home/OfferBanner";
import { OccasionStrip } from "@/components/home/OccasionStrip";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { ProductSection } from "@/components/product/ProductSection";
import {
  categories,
  heroSlides,
  offers,
  getFeaturedProducts,
  getNewProducts,
  getBestsellerProducts,
  getOfferProducts,
  getOccasionProducts,
} from "@/lib/data";

export default function HomePage() {
  const picks = getFeaturedProducts().slice(0, 8);
  const newest = getNewProducts().slice(0, 8);
  const bestsellers = getBestsellerProducts().slice(0, 8);
  const offerProducts = getOfferProducts().slice(0, 8);
  const occasions = getOccasionProducts().slice(0, 8);
  const spotlightOffers = offers.slice(0, 2);

  return (
    <>
      <Hero slides={heroSlides} />
      <CategoryCarousel categories={categories} />

      <ProductSection
        eyebrow="وصل حديثًا"
        title="أحدث نقشات الحناء"
        subtitle="تصاميم أنثوية جديدة للعروس والمناسبات والإطلالة اليومية"
        products={newest.length ? newest : picks}
        href="/new"
        tone="cream"
      />

      <OccasionStrip />

      <ProductSection
        eyebrow="اختيار العميلات"
        title="الأكثر طلبًا"
        subtitle="النقشات الأكثر مبيعًا — مثالية للزفاف والحفلات"
        products={bestsellers.length ? bestsellers : picks}
        href="/products"
      />

      <section className="container-pad py-7 sm:py-10 lg:py-12">
        <div className="mb-4 sm:mb-6">
          <p className="section-eyebrow">لفترة محدودة</p>
          <h2 className="section-title mt-1">عروض تليق بمناسبتكِ</h2>
        </div>
        <div className="grid gap-3 sm:gap-5 lg:grid-cols-2">
          {spotlightOffers.map((o) => (
            <OfferBanner key={o.id} offer={o} />
          ))}
        </div>
      </section>

      <ProductSection
        eyebrow="وفّري الآن"
        title="عروض خاصة"
        subtitle="أسعار مخفّضة على أجمل النقشات مع عدّاد ينتهي قريبًا"
        products={offerProducts}
        href="/offers"
        tone="blush"
      />

      <ProductSection
        eyebrow="زفاف · خطوبة · عيد"
        title="نقشات للمناسبات"
        subtitle="أنماط فاخرة للحظات التي لا تُنسى"
        products={occasions}
        href="/categories/al-munasabat"
      />

      <ProductSection
        eyebrow="اختيارات المحرّرة"
        title="اختياراتنا لكِ"
        subtitle="نقشات مميزة نوصي بها لكل امرأة تبحث عن أناقة هادئة"
        products={picks}
        href="/products"
        tone="cream"
      />

      <RecentlyViewed />
    </>
  );
}
