import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <section className="container-pad py-10 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow">اكتشفي المجموعة</p>
          <h2 className="section-title mt-1">الأقسام</h2>
        </div>
        <Link
          href="/categories"
          className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-henna transition hover:bg-henna-50"
        >
          عرض الكل
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-10">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex w-[5.25rem] shrink-0 flex-col items-center gap-2.5 sm:w-auto"
          >
            <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-full bg-cream-100 shadow-card ring-2 ring-transparent transition duration-300 group-hover:ring-henna/25 group-hover:shadow-soft sm:h-20 sm:w-20">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="80px"
                className="object-cover transition duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-center text-[11px] font-semibold leading-tight text-ink sm:text-xs">
              {c.name}
            </span>
            <span className="text-[10px] text-ink-light">{c.productCount} نقشة</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
