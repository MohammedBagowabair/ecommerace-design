import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";

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

  return (
    <div>
      <div className="relative h-44 overflow-hidden sm:h-56">
        <Image
          src={cat.image}
          alt={cat.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 container-pad pb-6">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{cat.name}</h1>
          <p className="mt-1 max-w-xl text-sm text-white/85">{cat.description}</p>
        </div>
      </div>
      <div className="container-pad py-6 sm:py-8">
        <ProductsBrowser initialCategorySlug={cat.slug} title={cat.name} />
      </div>
    </div>
  );
}
