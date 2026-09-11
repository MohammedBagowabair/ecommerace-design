import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <section className="container-pad section-pad !py-6 sm:!py-9">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div>
          <p className="section-eyebrow hidden sm:block">اكتشفي المجموعة</p>
          <h2 className="section-title mt-0 sm:mt-1">الأقسام</h2>
        </div>
        <Link
          href="/categories"
          className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold text-ink transition hover:bg-cream-100 sm:min-h-10 sm:px-2.5 sm:text-sm"
        >
          عرض الكل
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
      <div className="hide-scrollbar -mx-3 flex gap-3.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-10">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="group flex w-[4.5rem] shrink-0 flex-col items-center gap-2 sm:w-auto sm:gap-2.5"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-cream-100 ring-1 ring-cream-200 transition duration-200 group-hover:ring-2 group-hover:ring-ink sm:h-[4.5rem] sm:w-[4.5rem]">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="72px"
                loading="lazy"
                className="object-cover transition duration-400 motion-safe:group-hover:scale-105"
              />
            </div>
            <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-ink sm:text-xs">
              {c.name}
            </span>
            <span className="hidden text-[10px] tracking-wide text-ink-light sm:inline">
              {c.productCount} نقشة
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
