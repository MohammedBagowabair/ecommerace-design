import {
  categories,
  expandCategoryIds,
} from "./data/categories";
import { products } from "./data/products";
import type { Product, SortOption } from "./types";
import { productMatchesQuery } from "./utils";

export type CatalogFilterInput = {
  categories: string[];
  subcategories?: string[];
  patternTypes: string[];
  occasions: string[];
  priceMin: number;
  priceMax: number;
  inStockOnly: boolean;
  minRating: number;
  onSaleOnly: boolean;
  sort: SortOption;
  query?: string;
  onlyNew?: boolean;
  onlyOffers?: boolean;
  /** Optional catalog override (e.g. admin-merged client list) */
  sourceProducts?: Product[];
  sourceCategories?: typeof categories;
};

export function filterAndSortProducts(input: CatalogFilterInput): Product[] {
  const catalog = input.sourceCategories ?? categories;
  let list = (input.sourceProducts ?? products).filter((p) => !p.isStub);

  const q = input.query?.trim();
  if (q) list = list.filter((p) => productMatchesQuery(p, q));

  if (input.onlyNew) list = list.filter((p) => p.isNew);
  if (input.onSaleOnly || input.onlyOffers) {
    list = list.filter((p) => p.isOffer || !!p.compareAtPrice);
  }

  if (input.categories.length) {
    const selected = catalog.filter((c) => input.categories.includes(c.slug));
    const ids = expandCategoryIds(selected.map((c) => c.id), catalog);
    list = list.filter(
      (p) =>
        p.categoryIds.some((id) => ids.includes(id)) ||
        (p.subcategoryId ? ids.includes(p.subcategoryId) : false)
    );
  }

  const subcats = input.subcategories ?? [];
  if (subcats.length) {
    const subIds = new Set(
      catalog
        .filter(
          (c) =>
            subcats.includes(c.slug) ||
            subcats.includes(c.id)
        )
        .map((c) => c.id)
    );
    list = list.filter(
      (p) =>
        p.categoryIds.some((id) => subIds.has(id)) ||
        (p.subcategoryId ? subIds.has(p.subcategoryId) : false)
    );
  }

  if (input.patternTypes.length) {
    list = list.filter(
      (p) => p.patternType && input.patternTypes.includes(p.patternType)
    );
  }

  if (input.occasions.length) {
    list = list.filter(
      (p) => p.occasion && input.occasions.includes(p.occasion)
    );
  }

  list = list.filter(
    (p) => p.price >= input.priceMin && p.price <= input.priceMax
  );

  if (input.inStockOnly) list = list.filter((p) => p.stock > 0);
  if (input.minRating > 0) list = list.filter((p) => p.rating >= input.minRating);

  switch (input.sort) {
    case "newest":
      return [...list].sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id)
      );
    case "price_asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price_desc":
      return [...list].sort((a, b) => b.price - a.price);
    case "rating":
      return [...list].sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    case "bestseller":
      return [...list].sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) ||
          b.reviewCount - a.reviewCount
      );
    default:
      return [...list].sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating
      );
  }
}

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "المميزة" },
  { value: "newest", label: "الأحدث" },
  { value: "bestseller", label: "الأكثر مبيعًا" },
  { value: "rating", label: "الأعلى تقييمًا" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
];
