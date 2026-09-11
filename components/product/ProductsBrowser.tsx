"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Filter, X } from "lucide-react";
import { filterAndSortProducts, sortOptions } from "@/lib/catalog";
import { categories as seedCategories } from "@/lib/data";
import type { SortOption } from "@/lib/types";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { mergeCategories, mergeProducts } from "@/lib/admin/merged-catalog";
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
  const productOverrides = useAdminOpsStore((s) => s.productOverrides);
  const customProducts = useAdminOpsStore((s) => s.customProducts);
  const catOverrides = useAdminOpsStore((s) => s.categoryOverrides);
  const customCategories = useAdminOpsStore((s) => s.customCategories);
  const ensureOps = useAdminOpsStore((s) => s.ensureSeeded);

  useEffect(() => {
    ensureOps();
  }, [ensureOps]);

  const mergedProducts = useMemo(
    () =>
      mergeProducts(productOverrides, customProducts).filter(
        (p) => p.isActive !== false
      ),
    [productOverrides, customProducts]
  );
  const categories = useMemo(
    () => mergeCategories(catOverrides, mergedProducts, customCategories),
    [catOverrides, mergedProducts, customCategories]
  );

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
        sourceProducts: mergedProducts,
        sourceCategories: categories.length ? categories : seedCategories,
      }),
    [filters, initialQuery, onlyNew, onlyOffers, mergedProducts, categories]
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
  (filters.subcategories ?? []).forEach((slug) =>
    activeChips.push({
      key: `sub-${slug}`,
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      clear: () =>
        setFilters((f) => ({
          ...f,
          subcategories: (f.subcategories ?? []).filter((c) => c !== slug),
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
            className="btn-outline min-h-11 gap-2 px-4 lg:hidden"
            onClick={() => setDrawer(true)}
          >
            <Filter className="h-4 w-4" />
            تصفية
            {activeChips.length > 0 && (
              <span className="rounded-full bg-henna px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeChips.length}
              </span>
            )}
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
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="تصفية"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 motion-safe:animate-fadeIn"
            aria-label="إغلاق"
            onClick={() => setDrawer(false)}
          />
          <div className="bottom-sheet motion-safe:animate-slideUp">
            <div className="flex shrink-0 justify-center pt-2.5 pb-1">
              <span className="h-1 w-10 rounded-full bg-cream-300" aria-hidden />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
              <ProductFiltersPanel
                filters={filters}
                onChange={setFilters}
                onClose={() => setDrawer(false)}
                showSort
                compact
              />
            </div>
            <div className="shrink-0 border-t border-cream-200 bg-white px-3 pt-3 safe-bottom">
              <div className="flex gap-2 pb-1">
                <button
                  type="button"
                  className="btn-outline min-h-12 flex-1"
                  onClick={() =>
                    setFilters({
                      ...defaultFilters,
                      onSaleOnly: !!onlyOffers,
                      categories: initialCategorySlug ? [initialCategorySlug] : [],
                    })
                  }
                >
                  مسح
                </button>
                <button
                  type="button"
                  className="btn-primary min-h-12 flex-[1.4]"
                  onClick={() => setDrawer(false)}
                >
                  عرض {filtered.length}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
