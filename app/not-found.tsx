import Link from "next/link";
import { Home, Search, Sparkles, Tag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-pad flex flex-col items-center py-16 text-center sm:py-24">
      <div className="relative mb-2">
        <p className="select-none text-7xl font-bold leading-none text-henna/15 sm:text-8xl">
          404
        </p>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-henna-50 text-henna shadow-card">
            <Search className="h-6 w-6" strokeWidth={1.5} />
          </span>
        </span>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">
        الصفحة غير موجودة
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        عذرًا، لم نعثر على الصفحة التي تبحثين عنها. ربما تم نقل الرابط أو أن
        النقشة لم تعد متاحة. جرّبي البحث أو تصفّحي الأقسام.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          العودة للرئيسية
        </Link>
        <Link href="/products" className="btn-outline">
          <Sparkles className="h-4 w-4" />
          تصفحي النقشات
        </Link>
        <Link href="/search" className="btn-outline">
          <Search className="h-4 w-4" />
          البحث
        </Link>
      </div>

      <div className="mt-10 grid w-full max-w-lg gap-3 sm:grid-cols-3">
        {[
          { href: "/offers", label: "العروض", icon: Tag },
          { href: "/new", label: "الجديد", icon: Sparkles },
          { href: "/categories", label: "الأقسام", icon: Home },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white px-4 py-5 text-sm font-semibold text-ink shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <Icon className="h-5 w-5 text-henna" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
