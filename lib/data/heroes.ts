import type { HeroSlide } from "../types";

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "نقشات تليق بجمالك",
    subtitle: "استكشفي أجمل تصاميم استكيرات الحناء النسائية بلمسة عصرية فاخرة",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80",
    ctaPrimary: { label: "تسوقي الآن", href: "/products" },
    ctaSecondary: { label: "شاهدي النقشات", href: "/categories" },
  },
  {
    id: "hero-2",
    title: "مجموعة العروس الخاصة",
    subtitle: "تصاميم ملكية لليلة العمر — طقم متكامل لليدين والقدمين",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=80",
    ctaPrimary: { label: "تسوقي الآن", href: "/categories/al-arous" },
    ctaSecondary: { label: "شاهدي النقشات", href: "/products?category=al-arous" },
  },
  {
    id: "hero-3",
    title: "عروض خاصة لفترة محدودة",
    subtitle: "خصومات مميزة على أجمل النقشات مع توصيل إلى مختلف المناطق",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=80",
    ctaPrimary: { label: "تسوقي الآن", href: "/offers" },
    ctaSecondary: { label: "شاهدي النقشات", href: "/new" },
  },
  {
    id: "hero-4",
    title: "نقوش ناعمة لكل يوم",
    subtitle: "اختاري من التصاميم البسيطة والناعمة لإطلالة يومية أنيقة",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&q=80",
    ctaPrimary: { label: "تسوقي الآن", href: "/categories/naima" },
    ctaSecondary: { label: "شاهدي النقشات", href: "/products" },
  },
];
