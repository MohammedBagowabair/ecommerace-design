"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brand, navLinks } from "@/lib/data";
import { getParentCategories } from "@/lib/data/categories";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { resolveDeliveryCopy } from "@/lib/delivery-settings";

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
    <footer className="mt-12 border-t border-cream-200 bg-white sm:mt-20">
      <div className="container-pad grid gap-8 py-10 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-bold text-henna">
            {storeName}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            {brand.tagline}. متجر نسائي فاخر لاستكيرات نقشات الحناء — تصاميم عصرية
            للمناسبات والأعراس والإطلالات اليومية.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-henna">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">الأقسام</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {parents.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="transition hover:text-henna"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">معلومات</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
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
                className="font-semibold text-henna hover:underline"
              >
                واتساب {whatsappDisplay}
              </a>
            </li>
            <li className="pt-2 text-xs text-ink-light">
              الأسعار بـ {brand.currency}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 py-4 text-center text-xs text-ink-light">
        © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
