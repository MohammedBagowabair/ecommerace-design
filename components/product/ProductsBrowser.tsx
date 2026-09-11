"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { filterAndSortProducts, sortOptions } from "@/lib/catalog";
import { categories } from "@/lib/data";
import type { SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductGrid } from "./ProductGrid";
import {
  ProductFiltersPanel,
  defaultFilters,
  type FilterState,
} from "./ProductFilters";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export function ProductsBrowser({
  initialCategorySlug,
  initialPattern,
  initialOccasion,
  initialQuery,
  onlyNew,
  onlyOffers,
  title,
}: {
  initialCategorySlug?: string;
  initialPattern?: string;
  initialOccasion?: string;
  initialQuery?: string;
  onlyNew?: boolean;
  onlyOffers?: boolean;
  title?: string;
}) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilters,
    categories: initialCategorySlug ? [initialCategorySlug] : [],
    patternTypes: initialPattern ? [initialPattern] : [],
    occasions: initialOccasion ? [initialOccasion] : [],
    onSaleOnly: !!onlyOffers,
  }));
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [filters, initialQuery]);

  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      categories: initialCategorySlug ? [initialCategorySlug] : f.categories,
      patternTypes: initialPattern ? [initialPattern] : f.patternTypes,
      occasions: initialOccasion ? [initialOccasion] : f.occasions,
      onSaleOnly: onlyOffers ? true : f.onSaleOnly,
    }));
  }, [initialCategorySlug, initialPattern, initialOccasion, onlyOffers]);

  const filtered = useMemo(
    () =>
      filterAndSortProducts({
        ...filters,
        query: initialQuery,
        onlyNew,
        onlyOffers,
      }),
    [filters, initialQuery, onlyNew, onlyOffers]
  );

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  filters.categories.forEach((slug) =>
    activeChips.push({
      key: `cat-${slug}`,
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      clear: () =>
        setFilters((f) => ({
          ...f,
          categories: f.categories.filter((c) => c !== slug),
        })),
    })
  );
  filters.patternTypes.forEach((p) =>
    activeChips.push({
      key: `pat-${p}`,
      label: p,
      clear: () =>
        setFilters((f) => ({
          ...f,
          patternTypes: f.patternTypes.filter((x) => x !== p),
        })),
    })
  );
  filters.occasions.forEach((o) =>
    activeChips.push({
      key: `occ-${o}`,
      label: o,
      clear: () =>
        setFilters((f) => ({
          ...f,
          occasions: f.occasions.filter((x) => x !== o),
        })),
    })
  );
  if (filters.inStockOnly) {
    activeChips.push({
      key: "stock",
      label: "المتوفر فقط",
      clear: () => setFilters((f) => ({ ...f, inStockOnly: false })),
    });
  }
  if (filters.onSaleOnly && !onlyOffers) {
    activeChips.push({
      key: "sale",
      label: "عروض وخصومات",
      clear: () => setFilters((f) => ({ ...f, onSaleOnly: false })),
    });
  }
  if (filters.minRating > 0) {
    activeChips.push({
      key: "rating",
      label: `${filters.minRating}+ ★`,
      clear: () => setFilters((f) => ({ ...f, minRating: 0 })),
    });
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h1 className="page-title">{title}</h1>}
          {initialQuery && (
            <p className="mt-1 text-sm text-ink-muted">
              نتائج البحث عن «{initialQuery}»
            </p>
          )}
          <p className="mt-1 text-sm text-ink-muted">{filtered.length} منتج</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="hidden items-center gap-2 text-sm text-ink-muted sm:inline-flex">
            <ArrowUpDown className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">ترتيب</span>
            <select
              className="input-pill rounded-2xl py-2 pe-8 ps-3 text-sm"
              value={filters.sort}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  sort: e.target.value as SortOption,
                }))
              }
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="btn-outline lg:hidden"
            onClick={() => setDrawer(true)}
          >
            <Filter className="h-4 w-4" />
            تصفية وترتيب
          </button>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1 rounded-full bg-henna-50 px-3 py-1 text-xs font-semibold text-henna"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-ink-muted underline-offset-2 hover:underline"
            onClick={() =>
              setFilters({
                ...defaultFilters,
                onSaleOnly: !!onlyOffers,
                categories: initialCategorySlug ? [initialCategorySlug] : [],
              })
            }
          >
            مسح الكل
          </button>
        </div>
      )}

      <div className="flex gap-6">
        <div className="hidden w-72 shrink-0 lg:block">
          <ProductFiltersPanel
            filters={filters}
            onChange={setFilters}
            showSort={false}
          />
        </div>
        <div className="min-w-0 flex-1">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid
              products={filtered}
              emptyTitle={initialQuery ? "لا نتائج لهذا البحث" : "لا توجد نتائج"}
              emptyDescription={
                initialQuery
                  ? `لم نعثر على نقشات تطابق «${initialQuery}». جرّبي كلمات أخرى أو أزيلي بعض الفلاتر.`
                  : "عدّلي الفلاتر أو أعيدي التعيين لعرض المزيد من النقشات."
              }
              emptyIcon={initialQuery ? "search" : "products"}
            />
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="تصفية وترتيب">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 animate-fadeIn"
            aria-label="إغلاق"
            onClick={() => setDrawer(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 start-0 flex w-[min(100%,22rem)] flex-col overflow-y-auto bg-cream p-4 shadow-float animate-slideInStart"
            )}
          >
            <ProductFiltersPanel
              filters={filters}
              onChange={setFilters}
              onClose={() => setDrawer(false)}
              showSort
            />
            <button
              type="button"
              className="btn-primary mt-4 w-full shrink-0"
              onClick={() => setDrawer(false)}
            >
              عرض {filtered.length} نتيجة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
