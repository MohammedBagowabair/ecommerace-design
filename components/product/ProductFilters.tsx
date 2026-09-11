"use client";

import { categories, occasions, patternTypes, priceRange } from "@/lib/data";
import { getChildCategories, getParentCategories } from "@/lib/data/categories";
import { sortOptions } from "@/lib/catalog";
import type { SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type FilterState = {
  categories: string[];
  subcategories: string[];
  patternTypes: string[];
  occasions: string[];
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  minRating: number;
  onSaleOnly: boolean;
  sort: SortOption;
};

export const defaultFilters: FilterState = {
  categories: [],
  subcategories: [],
  patternTypes: [],
  occasions: [],
  priceMin: priceRange.min,
  priceMax: priceRange.max,
  inStockOnly: false,
  minRating: 0,
  onSaleOnly: false,
  sort: "featured",
};

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function FilterSection({
  title,
  hint,
  children,
  compact,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-0.5 text-sm font-bold text-ink">{title}</h3>
      {hint && !compact && (
        <p className="mb-2.5 text-[11px] leading-relaxed text-ink-light">{hint}</p>
      )}
      {(!hint || compact) && <div className="mb-2" />}
      {children}
    </div>
  );
}

export function ProductFiltersPanel({
  filters,
  onChange,
  onClose,
  className,
  showSort = true,
  compact = false,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose?: () => void;
  className?: string;
  showSort?: boolean;
  compact?: boolean;
}) {
  return (
    <aside
      className={cn(
        "space-y-5 rounded-xl border border-cream-200 bg-white p-4 shadow-card sm:space-y-5 sm:p-5",
        compact && "space-y-4 rounded-lg border-0 bg-transparent p-1 shadow-none sm:p-1",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-ink">
            {compact ? "تصفية" : "تصفية النتائج"}
          </h2>
          {!compact && (
            <p className="mt-0.5 text-[11px] text-ink-light">اختاري ما يناسب ذوقكِ</p>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-cream-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showSort && (
        <FilterSection title="الترتيب" hint="كيف تفضّلين عرض النقشات؟" compact={compact}>
          <select
            className="input-field"
            value={filters.sort}
            onChange={(e) =>
              onChange({ ...filters, sort: e.target.value as SortOption })
            }
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      <FilterSection title="القسم" hint="يد، قدم، مناسبات…" compact={compact}>
        <div className="flex flex-col gap-1">
          {getParentCategories(categories).map((c) => (
            <label
              key={c.id}
              className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-ink-muted transition hover:bg-cream-100"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(c.slug)}
                onChange={() =>
                  onChange({
                    ...filters,
                    categories: toggleInList(filters.categories, c.slug),
                  })
                }
                className="h-4 w-4 rounded border-cream-300 text-henna focus:ring-henna"
              />
              <span className="font-medium">{c.name}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="الأقسام الفرعية" hint="حسب القسم الرئيسي المختار" compact={compact}>
        <div className="flex flex-wrap gap-2">
          {(filters.categories.length
            ? filters.categories.flatMap((slug) => {
                const parent = categories.find((c) => c.slug === slug);
                return parent ? getChildCategories(parent.id) : [];
              })
            : categories.filter((c) => !!c.parentId)
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  subcategories: toggleInList(filters.subcategories, c.slug),
                })
              }
              className={
                filters.subcategories.includes(c.slug) ? "chip-active" : "chip-idle"
              }
            >
              {c.name}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="نوع النقشة" compact={compact}>
        <div className="flex flex-wrap gap-2">
          {patternTypes.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  patternTypes: toggleInList(filters.patternTypes, p),
                })
              }
              className={cn(
                filters.patternTypes.includes(p) ? "chip-active" : "chip-idle"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="المناسبة" compact={compact}>
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  occasions: toggleInList(filters.occasions, o),
                })
              }
              className={cn(
                filters.occasions.includes(o) ? "chip-active" : "chip-idle"
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="السعر (ر.ي)" hint="حدّدي الميزانية المناسبة" compact={compact}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            aria-label="السعر الأدنى"
            className="input-field"
            value={filters.priceMin}
            min={priceRange.min}
            max={filters.priceMax}
            onChange={(e) =>
              onChange({ ...filters, priceMin: Number(e.target.value) || 0 })
            }
          />
          <span className="shrink-0 text-ink-light">—</span>
          <input
            type="number"
            aria-label="السعر الأعلى"
            className="input-field"
            value={filters.priceMax}
            min={filters.priceMin}
            max={priceRange.max}
            onChange={(e) =>
              onChange({
                ...filters,
                priceMax: Number(e.target.value) || priceRange.max,
              })
            }
          />
        </div>
      </FilterSection>

      <FilterSection title="التوفر والخصم" compact={compact}>
        <div className="space-y-1">
          <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-ink-muted transition hover:bg-cream-100">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) =>
                onChange({ ...filters, inStockOnly: e.target.checked })
              }
              className="h-4 w-4 rounded border-cream-300 text-henna"
            />
            <span className="font-medium">المتوفر فقط</span>
          </label>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-ink-muted transition hover:bg-cream-100">
            <input
              type="checkbox"
              checked={filters.onSaleOnly}
              onChange={(e) =>
                onChange({ ...filters, onSaleOnly: e.target.checked })
              }
              className="h-4 w-4 rounded border-cream-300 text-henna"
            />
            <span className="font-medium">عروض وخصومات</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="التقييم" compact={compact}>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange({ ...filters, minRating: r })}
              className={cn(
                filters.minRating === r ? "chip-active" : "chip-idle"
              )}
            >
              {r === 0 ? "الكل" : `${r}+ ★`}
            </button>
          ))}
        </div>
      </FilterSection>

      {!compact && (
        <button
          type="button"
          className="btn-outline w-full"
          onClick={() => onChange({ ...defaultFilters })}
        >
          إعادة تعيين الفلاتر
        </button>
      )}
    </aside>
  );
}
