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
    <footer className="mt-10 border-t border-ink bg-ink text-white sm:mt-16">
      <div className="container-pad grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
            {storeName}
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            {brand.tagline}. متجر نسائي لاستكيرات نقشات الحناء — تصاميم عصرية
            للمناسبات والأعراس والإطلالات اليومية.
          </p>
          <div className="mt-4 h-0.5 w-10 bg-rose-500" aria-hidden />
        </div>

        <div>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-luxury-wide text-rose-400">
            روابط سريعة
          </h3>
          <ul className="space-y-2 text-sm text-white/65">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-luxury-wide text-rose-400">
            الأقسام
          </h3>
          <ul className="space-y-2 text-sm text-white/65">
            {parents.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="transition hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mb-3 mt-7 text-[10px] font-bold uppercase tracking-luxury-wide text-rose-400">
            معلومات المتجر
          </h3>
          <ul className="space-y-2 text-sm text-white/65">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-luxury-wide text-rose-400">
            تواصل
          </h3>
          <ul className="space-y-2 text-sm text-white/65">
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
                className="font-semibold text-rose-300 transition hover:text-rose-200"
              >
                واتساب {whatsappDisplay}
              </a>
            </li>
            <li>
              <Link href="/contact" className="font-semibold text-rose-300 transition hover:text-rose-200">
                نموذج تواصل معنا
              </Link>
            </li>
            <li className="pt-2 text-xs text-white/40">
              الأسعار بـ {brand.currency}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] tracking-wide text-white/40">
        © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
