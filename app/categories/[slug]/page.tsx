import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getCategoryBySlug,
  getChildCategories,
  getCategoryById,
} from "@/lib/data/categories";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";
import { SafeMedia } from "@/components/media/SafeMedia";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return { title: "قسم غير موجود" };
  return { title: cat.name, description: cat.description };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const children = getChildCategories(cat.id);
  const parent = cat.parentId ? getCategoryById(cat.parentId) : null;
  const siblings = parent ? getChildCategories(parent.id) : [];

  return (
    <div>
      <div className="relative h-44 overflow-hidden sm:h-56">
        <SafeMedia
          src={cat.image}
          alt={cat.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 container-pad pb-6">
          {parent && (
            <Link
              href={`/categories/${parent.slug}`}
              className="mb-1 inline-block text-xs font-semibold text-white/80 hover:text-white"
            >
              ← {parent.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{cat.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-white/85">{cat.description}</p>
        </div>
      </div>

      {(children.length > 0 || siblings.length > 0) && (
        <div className="container-pad border-b border-cream-200 bg-white py-4">
          <p className="mb-2 text-xs font-bold text-ink-muted">
            {children.length ? "الأقسام الفرعية" : "أقسام ذات صلة"}
          </p>
          <div className="flex flex-wrap gap-2">
            {(children.length ? children : siblings).map((sub) => (
              <Link
                key={sub.id}
                href={`/categories/${sub.slug}`}
                className={
                  sub.slug === cat.slug
                    ? "chip-active"
                    : "chip-idle"
                }
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="container-pad py-6 sm:py-8">
        <ProductsBrowser initialCategorySlug={cat.slug} title={cat.name} />
      </div>
    </div>
  );
}
