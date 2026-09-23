import type { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "offer-1",
    title: "خصم العروس",
    description: "وفّري على مجموعات الزفاف الفاخرة — طقم اليدين والقدمين بلمسة ملكية لفترة محدودة",
    productIds: ["prod-002", "prod-006", "prod-014", "prod-034"],
    discountPercent: 15,
    endsAt: "2026-10-15T23:59:59+03:00",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    badge: "مجموعة العروس",
    href: "/offers/offer-1",
  },
  {
    id: "offer-2",
    title: "عرض النقشات الناعمة",
    description: "خصومات على التصاميم الناعمة والبسيطة لإطلالة يومية أنيقة",
    productIds: ["prod-001", "prod-004", "prod-009", "prod-016"],
    discountPercent: 18,
    endsAt: "2026-09-30T23:59:59+03:00",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    badge: "يومية ناعمة",
    href: "/offers/offer-2",
  },
  {
    id: "offer-3",
    title: "تخفيضات العيد",
    description: "نقشات عيدية بأسعار مميزة لتكملي إطلالتك في الأعياد والمناسبات",
    productIds: ["prod-010", "prod-020", "prod-033"],
    discountPercent: 12,
    endsAt: "2026-10-05T23:59:59+03:00",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
    badge: "عيد ومناسبات",
    href: "/offers/offer-3",
  },
  {
    id: "offer-4",
    title: "باقة الخطوبة الذهبية",
    description: "تصاميم راقية لليلة الخطوبة — خصم خاص على النقشات الذهبية والزهور",
    productIds: ["prod-005", "prod-012", "prod-018"],
    discountPercent: 20,
    endsAt: "2026-10-20T23:59:59+03:00",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    badge: "خطوبة",
    href: "/offers/offer-4",
  },
  {
    id: "offer-5",
    title: "عرض الحفلات المسائية",
    description: "نقشات جريئة ولامعة لسهرات الأفراح والحفلات الخاصة",
    productIds: ["prod-008", "prod-022", "prod-028"],
    discountPercent: 14,
    endsAt: "2026-09-25T23:59:59+03:00",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    badge: "حفلة",
    href: "/offers/offer-5",
  },
];

/** Dedicated storefront page for one campaign. */
export function getOfferHref(id: string): string {
  return `/offers/${encodeURIComponent(id)}`;
}

export function getOfferById(id: string): Offer | undefined {
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    decoded = id;
  }
  return offers.find((o) => o.id === id || o.id === decoded);
}

/** Resolve the soonest active campaign end date for a product */
export function getOfferEndsAtForProduct(productId: string): string | undefined {
  const matching = offers
    .filter((o) => o.endsAt && o.productIds.includes(productId))
    .sort(
      (a, b) =>
        new Date(a.endsAt!).getTime() - new Date(b.endsAt!).getTime()
    );
  return matching[0]?.endsAt;
}

export function getOfferTitleForProduct(productId: string): string | undefined {
  return offers.find((o) => o.productIds.includes(productId))?.title;
}

/** Fallback end for discounted products not tied to a campaign */
export const defaultOfferEndsAt = "2026-10-10T23:59:59+03:00";
