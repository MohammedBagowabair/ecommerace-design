"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand, navLinks } from "@/lib/data";
import { getParentCategories } from "@/lib/data/categories";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { resolveDeliveryCopy } from "@/lib/delivery-settings";

const infoLinks = [
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
  { href: "/faq", label: "أسئلة شائعة" },
  { href: "/shipping", label: "الشحن والتوصيل" },
  { href: "/refund", label: "الاسترجاع والاستبدال" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "الشروط والأحكام" },
];

export function Footer() {
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setMounted(true);
  }, [ensureSeeded]);

  const storeName = mounted && settings.storeName ? settings.storeName : brand.name;
  const whatsapp = mounted && settings.whatsapp ? settings.whatsapp : "967700000000";
  const whatsappDisplay =
    mounted && settings.whatsappDisplay
      ? settings.whatsappDisplay
      : "+967 700 000 000";
  const delivery = resolveDeliveryCopy(mounted ? settings : null);
  const parents = getParentCategories().slice(0, 5);

  return (
    <footer className="mt-14 border-t border-cream-200/60 bg-henna-900 text-cream-100 sm:mt-24">
      <div className="container-pad grid gap-10 py-12 sm:grid-cols-2 sm:gap-12 sm:py-16 lg:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-cream-50">
            {storeName}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/70">
            {brand.tagline}. متجر نسائي فاخر لاستكيرات نقشات الحناء — تصاميم عصرية
            للمناسبات والأعراس والإطلالات اليومية.
          </p>
          <div className="mt-5 h-px w-12 bg-gold-400/60" aria-hidden />
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-luxury-wide text-gold-400">
            روابط سريعة
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-200/75">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-cream-50">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-luxury-wide text-gold-400">
            الأقسام
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-200/75">
            {parents.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="transition hover:text-cream-50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mb-4 mt-8 text-[11px] font-medium uppercase tracking-luxury-wide text-gold-400">
            معلومات المتجر
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-200/75">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-cream-50">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-medium uppercase tracking-luxury-wide text-gold-400">
            تواصل
          </h3>
          <ul className="space-y-2.5 text-sm text-cream-200/75">
            <li>الدفع: تحويل بنكي</li>
            <li>
              {delivery.deliveryLabel}: {delivery.deliveryEta}
            </li>
            <li>
              الدعم:{" "}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold-300 transition hover:text-gold-200"
              >
                واتساب {whatsappDisplay}
              </a>
            </li>
            <li>
              <Link href="/contact" className="font-medium text-gold-300 transition hover:text-gold-200">
                نموذج تواصل معنا
              </Link>
            </li>
            <li className="pt-2 text-xs text-cream-200/50">
              الأسعار بـ {brand.currency}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-[11px] tracking-wide text-cream-200/45">
        © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
