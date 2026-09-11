import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "البحث",
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    pattern?: string;
    occasion?: string;
    category?: string;
  };
}) {
  const q = searchParams.q?.trim() ?? "";
  const hasQuery = Boolean(q);

  return (
    <div className="container-pad py-6 sm:py-8">
      <h1 className="page-title">البحث</h1>
      <SearchClient initialQuery={q} />

      {!hasQuery && !searchParams.pattern && !searchParams.occasion && !searchParams.category ? (
        <div className="mt-8">
          <EmptyState
            icon="search"
            title="ابحثي عن نقشة"
            description="اكتبي اسم النقشة أو النوع أو المناسبة، أو استخدمي شريط البحث في الأعلى للاقتراحات الفورية."
            actionLabel="تصفحي جميع النقشات"
            secondaryHref="/offers"
            secondaryLabel="شاهدي العروض"
          />
        </div>
      ) : (
        <div className="mt-8">
          <ProductsBrowser
            title={hasQuery ? undefined : "نتائج مفلترة"}
            initialQuery={q || undefined}
            initialPattern={searchParams.pattern}
            initialOccasion={searchParams.occasion}
            initialCategorySlug={searchParams.category}
          />
        </div>
      )}
    </div>
  );
}
