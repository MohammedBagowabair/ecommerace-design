import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryTree } from "@/lib/data/categories";
import { SafeMedia } from "@/components/media/SafeMedia";

export const metadata: Metadata = {
  title: "الأقسام",
};

export default function CategoriesPage() {
  const tree = getCategoryTree();

  return (
    <div className="container-pad py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">الأقسام</h1>
      <p className="mt-2 text-sm text-ink-muted">
        تصفّحي مجموعات نقشات الحناء حسب النوع والمناسبة — مع أقسام فرعية
      </p>
      <div className="mt-8 space-y-8">
        {tree.map((parent) => (
          <section key={parent.id}>
            <Link
              href={`/categories/${parent.slug}`}
              className="card-soft group flex flex-col overflow-hidden sm:flex-row"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-cream-100 sm:aspect-auto sm:h-40 sm:w-56">
                <SafeMedia
                  src={parent.image}
                  alt={parent.name}
                  fill
                  sizes="(max-width:640px) 100vw, 224px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-4 sm:p-5">
                <h2 className="text-lg font-bold text-ink">{parent.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                  {parent.description}
                </p>
              </div>
            </Link>
            {parent.children.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 ps-1">
                {parent.children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/categories/${sub.slug}`}
                    className="chip-idle hover:border-henna-200 hover:text-henna"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
