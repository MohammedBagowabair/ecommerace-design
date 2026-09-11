import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <section className="container-pad section-pad !py-7 sm:!py-10">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
        <div>
          <p className="section-eyebrow hidden sm:block">اكتشفي المجموعة</p>
          <h2 className="section-title mt-0 sm:mt-1">الأقسام</h2>
        </div>
        <Link
          href="/categories"
          className="inline-flex min-h-10 items-center gap-1 rounded-full px-2.5 text-xs font-semibold text-henna transition hover:bg-henna-50 sm:min-h-11 sm:px-3 sm:text-sm"
        >
          عرض الكل
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-10">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-auto sm:gap-2.5"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-cream-100 shadow-card ring-2 ring-transparent transition duration-300 group-hover:ring-henna/25 group-hover:shadow-soft sm:h-20 sm:w-20">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="80px"
                loading="lazy"
                className="object-cover transition duration-300 motion-safe:group-hover:scale-110"
              />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-ink sm:text-xs">
              {c.name}
            </span>
            <span className="hidden text-[10px] text-ink-light sm:inline">
              {c.productCount} نقشة
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
