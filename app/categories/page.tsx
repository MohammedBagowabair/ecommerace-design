import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "الأقسام",
};

export default function CategoriesPage() {
  return (
    <div className="container-pad py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">الأقسام</h1>
      <p className="mt-2 text-sm text-ink-muted">
        تصفّحي مجموعات نقشات الحناء حسب النوع والمناسبة
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="card-soft group overflow-hidden"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-ink">{c.name}</h2>
              <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{c.description}</p>
              <p className="mt-2 text-xs font-semibold text-henna">
                {c.productCount} نقشة
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
