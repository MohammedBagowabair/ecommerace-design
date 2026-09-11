import Link from "next/link";
import { brand, navLinks, categories } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-cream-200 bg-white">
      <div className="container-pad grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="text-2xl font-bold text-henna">
            {brand.name}
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
            <li>
              <Link href="/cart" className="transition hover:text-henna">
                السلة
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="transition hover:text-henna">
                المفضلة
              </Link>
            </li>
            <li>
              <Link href="/account" className="transition hover:text-henna">
                حسابي
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">الأقسام</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {categories.slice(0, 6).map((c) => (
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
            <li>التوصيل: مختلف المناطق</li>
            <li>
              الدعم:{" "}
              <a
                href="https://wa.me/967700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-henna hover:underline"
              >
                واتساب +967 700 000 000
              </a>
            </li>
            <li className="pt-2 text-xs text-ink-light">
              الأسعار بـ {brand.currency}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-200 py-4 text-center text-xs text-ink-light">
        © {new Date().getFullYear()} {brand.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
