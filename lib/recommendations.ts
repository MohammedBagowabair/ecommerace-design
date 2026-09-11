import {
  getProductById,
  getRelatedProducts,
  getSimilarProducts,
  products,
} from "./data/products";
import type { Product } from "./types";

function active(list: Product[]): Product[] {
  return list.filter((p) => !p.isStub);
}

function exclude(list: Product[], ids: Set<string>): Product[] {
  return list.filter((p) => !ids.has(p.id));
}

function scoreSimilar(a: Product, b: Product): number {
  let score = 0;
  if (a.patternType && a.patternType === b.patternType) score += 5;
  if (a.occasion && a.occasion === b.occasion) score += 4;
  const sharedCats = a.categoryIds.filter((c) => b.categoryIds.includes(c)).length;
  score += sharedCats * 3;
  const sharedTags = a.tags.filter((t) => b.tags.includes(t)).length;
  score += sharedTags;
  if (Math.abs(a.price - b.price) < a.price * 0.25) score += 2;
  if (b.isBestseller) score += 1;
  if (b.rating >= 4) score += 1;
  return score;
}

/** نقشات مشابهة — نفس النوع / الأقسام / المناسبة */
export function recommendSimilarPatterns(
  product: Product,
  limit = 8
): Product[] {
  const scored = active(products)
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, score: scoreSimilar(product, p) }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.p.rating - a.p.rating || b.p.reviewCount - a.p.reviewCount
    );
  if (scored.length >= limit) return scored.slice(0, limit).map((x) => x.p);
  const fallback = getSimilarProducts(product, limit);
  const ids = new Set(scored.map((x) => x.p.id));
  return [
    ...scored.map((x) => x.p),
    ...fallback.filter((p) => !ids.has(p.id)),
  ].slice(0, limit);
}

/** منتجات مرتبطة — نفس النمط أو المناسبة أو الوسوم */
export function recommendRelated(product: Product, limit = 8): Product[] {
  const base = getRelatedProducts(product, limit * 2);
  const used = new Set(base.map((p) => p.id));
  used.add(product.id);

  const extras = active(products)
    .filter((p) => !used.has(p.id))
    .filter(
      (p) =>
        p.tags.some((t) => product.tags.includes(t)) ||
        p.categoryIds.some((c) => product.categoryIds.includes(c))
    )
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating);

  return [...base, ...extras].slice(0, limit);
}

/**
 * قد تحتاجين أيضًا — مكملات وهمية:
 * مناسبات قريبة، عروض، أو أنواع مختلفة لنفس المناسبة
 */
export function recommendYouMayAlsoNeed(
  product: Product,
  limit = 8
): Product[] {
  const used = new Set([product.id]);
  const pick = (list: Product[]) => {
    const next = exclude(list, used).slice(0, limit);
    next.forEach((p) => used.add(p.id));
    return next;
  };

  const sameOccasionDifferentPattern = active(products).filter(
    (p) =>
      p.id !== product.id &&
      p.occasion === product.occasion &&
      p.patternType !== product.patternType
  );

  const offersNearby = active(products)
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.isOffer || !!p.compareAtPrice) &&
        (p.occasion === product.occasion ||
          p.categoryIds.some((c) => product.categoryIds.includes(c)))
    )
    .sort((a, b) => a.price - b.price);

  const bestsellers = active(products)
    .filter((p) => p.isBestseller && p.id !== product.id)
    .sort((a, b) => b.rating - a.rating);

  return [
    ...pick(sameOccasionDifferentPattern),
    ...pick(offersNearby),
    ...pick(bestsellers),
  ].slice(0, limit);
}

/** شاهدتِ مؤخرًا — من معرفات المخزن مع استبعاد المنتج الحالي */
export function recommendRecentlyViewed(
  ids: string[],
  excludeId?: string,
  limit = 8
): Product[] {
  const out: Product[] = [];
  for (const id of ids) {
    if (id === excludeId) continue;
    const p = getProductById(id);
    if (p && !p.isStub) out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

export interface PdpRecommendations {
  similar: Product[];
  related: Product[];
  alsoNeed: Product[];
}

export function getPdpRecommendations(
  product: Product,
  limits = { similar: 8, related: 8, alsoNeed: 8 }
): PdpRecommendations {
  const similar = recommendSimilarPatterns(product, limits.similar);
  const similarIds = new Set(similar.map((p) => p.id));
  const related = recommendRelated(product, limits.related).filter(
    (p) => !similarIds.has(p.id)
  );
  const used = new Set<string>([product.id, ...Array.from(similarIds), ...related.map((p) => p.id)]);
  const alsoNeed = recommendYouMayAlsoNeed(product, limits.alsoNeed).filter(
    (p) => !used.has(p.id)
  );

  return { similar, related, alsoNeed };
}
