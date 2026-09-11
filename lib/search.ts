import { categories } from "./data/categories";
import { occasions, patternTypes, products } from "./data/products";
import type { Product } from "./types";
import { productMatchesQuery } from "./utils";

export type SearchSuggestionKind =
  | "product"
  | "category"
  | "pattern"
  | "occasion";

export interface SearchSuggestion {
  id: string;
  kind: SearchSuggestionKind;
  label: string;
  href: string;
  meta?: string;
  image?: string;
}

const RECENT_KEY = "naqshat-recent-searches";
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_RECENT)
      : [];
  } catch {
    return [];
  }
}

export function pushRecentSearch(q: string): void {
  const query = q.trim();
  if (!query || typeof window === "undefined") return;
  const next = [query, ...getRecentSearches().filter((x) => x !== query)].slice(
    0,
    MAX_RECENT
  );
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_KEY);
}

/** Live suggestions while typing — product name, category, pattern, occasion */
export function getSearchSuggestions(
  q: string,
  limits = { products: 6, categories: 4, patterns: 4, occasions: 4 }
): SearchSuggestion[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];

  const out: SearchSuggestion[] = [];

  const matchedProducts = products
    .filter((p) => !p.isStub && productMatchesQuery(p, query))
    .slice(0, limits.products);

  for (const p of matchedProducts) {
    out.push({
      id: `product-${p.id}`,
      kind: "product",
      label: p.name,
      href: `/products/${p.slug}`,
      meta: [p.patternType, p.occasion].filter(Boolean).join(" · "),
      image: p.images[0],
    });
  }

  const matchedCats = categories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.slug.includes(query)
    )
    .slice(0, limits.categories);

  for (const c of matchedCats) {
    out.push({
      id: `category-${c.id}`,
      kind: "category",
      label: c.name,
      href: `/categories/${c.slug}`,
      meta: `${c.productCount} نقشة`,
      image: c.image,
    });
  }

  const matchedPatterns = patternTypes
    .filter((p) => p.toLowerCase().includes(query))
    .slice(0, limits.patterns);

  for (const p of matchedPatterns) {
    out.push({
      id: `pattern-${p}`,
      kind: "pattern",
      label: p,
      href: `/search?q=${encodeURIComponent(p)}&pattern=${encodeURIComponent(p)}`,
      meta: "نوع النقشة",
    });
  }

  const matchedOccasions = occasions
    .filter((o) => o.toLowerCase().includes(query))
    .slice(0, limits.occasions);

  for (const o of matchedOccasions) {
    out.push({
      id: `occasion-${o}`,
      kind: "occasion",
      label: o,
      href: `/search?q=${encodeURIComponent(o)}&occasion=${encodeURIComponent(o)}`,
      meta: "مناسبة",
    });
  }

  return out;
}

export function searchProducts(q: string): Product[] {
  const query = q.trim();
  if (!query) return [];
  return products.filter((p) => !p.isStub && productMatchesQuery(p, query));
}

export const suggestionKindLabel: Record<SearchSuggestionKind, string> = {
  product: "منتجات",
  category: "أقسام",
  pattern: "أنواع النقوش",
  occasion: "مناسبات",
};

export const popularSearches = [
  "عروس",
  "ناعمة",
  "زفاف",
  "أصابع",
  "عيد",
  "خطوبة",
];
