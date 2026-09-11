export * from "./categories";
export * from "./products";
export * from "./heroes";
export * from "./offers";
export * from "./reviews";
export * from "./checkout";
export * from "./seed-orders";

export const brand = {
  name: "نقشات",
  nameEn: "Naqshat",
  tagline: "أجمل نقشات الحناء بين يديك",
  currency: "ريال يمني",
  currencyShort: "ر.ي",
};

export const announcementMessages = [
  "أجمل نقشات الحناء بين يديكِ",
  "التوصيل حسب مدة أيام العمل في الإعدادات",
  "عروض العروس والمناسبات لفترة محدودة",
  "الدفع عن طريق التحويل البنكي",
  "تصاميم مميزة للزفاف · الخطوبة · العيد",
  "خصومات حصرية — تسوّقي من صفحة العروض",
];

export const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "النقشات" },
  { href: "/categories", label: "الأقسام" },
  { href: "/offers", label: "العروض" },
  { href: "/new", label: "الجديد" },
];
