import { categories as seedCategories } from "../data/categories";
import { products as seedProducts } from "../data/products";
import { offers as seedOffers } from "../data/offers";
import { getStockStatus } from "../utils";
import type { Category, Offer, Order, Product } from "../types";
import type {
  AdminCustomer,
  CategoryOverride,
  CustomCategory,
  CustomProduct,
  MergedCategory,
  MergedOffer,
  MergedProduct,
  ProductOverride,
} from "./ops-types";
import { expandCategoryIds } from "../data/categories";

export function mergeProduct(
  base: Product,
  override?: ProductOverride,
  isCustom = false
): MergedProduct {
  if (!override) return { ...base, isActive: true, isCustom };
  const stock = override.stock ?? base.stock;
  const stockStatus =
    override.stockStatus ??
    (override.stock !== undefined ? getStockStatus(stock) : base.stockStatus);
  const compareAt =
    override.compareAtPrice === null
      ? undefined
      : override.compareAtPrice !== undefined
        ? override.compareAtPrice
        : base.compareAtPrice;

  return {
    ...base,
    name: override.name ?? base.name,
    description: override.description ?? base.description,
    price: override.price ?? base.price,
    compareAtPrice: compareAt,
    stock,
    stockStatus,
    categoryIds: override.categoryIds ?? base.categoryIds,
    subcategoryId:
      override.subcategoryId === null
        ? undefined
        : override.subcategoryId !== undefined
          ? override.subcategoryId
          : base.subcategoryId,
    badges: override.badges ?? base.badges,
    images:
      override.images && override.images.length > 0
        ? override.images
        : base.images,
    videos:
      override.videos !== undefined
        ? override.videos
        : base.videos,
    isFeatured: override.isFeatured ?? base.isFeatured,
    isOffer: override.isOffer ?? base.isOffer,
    isNew: override.isNew ?? base.isNew,
    isBestseller: override.isBestseller ?? base.isBestseller,
    isActive: override.isActive ?? true,
    isCustom,
  };
}

export function mergeProducts(
  overrides: Record<string, ProductOverride>,
  customProducts: CustomProduct[] = []
): MergedProduct[] {
  const fromSeed = seedProducts
    .filter((p) => !p.isStub)
    .map((p) => mergeProduct(p, overrides[p.id], false));

  const customIds = new Set(customProducts.map((p) => p.id));
  const fromCustom = customProducts.map((p) => {
    const { isActive, createdAt: _c, ...rest } = p;
    void _c;
    const merged = mergeProduct(rest, overrides[p.id], true);
    return { ...merged, isActive: overrides[p.id]?.isActive ?? isActive };
  });

  // Prefer custom entry if id collision
  const seedFiltered = fromSeed.filter((p) => !customIds.has(p.id));
  return [...fromCustom, ...seedFiltered];
}

export function mergeProductById(
  id: string,
  overrides: Record<string, ProductOverride>,
  customProducts: CustomProduct[] = []
): MergedProduct | undefined {
  const custom = customProducts.find((p) => p.id === id);
  if (custom) {
    const { isActive, createdAt: _c, ...rest } = custom;
    void _c;
    const merged = mergeProduct(rest, overrides[id], true);
    return { ...merged, isActive: overrides[id]?.isActive ?? isActive };
  }
  const base = seedProducts.find((p) => p.id === id);
  if (!base || base.isStub) return undefined;
  return mergeProduct(base, overrides[id], false);
}

export function mergeCategory(
  base: Category,
  override?: CategoryOverride,
  productCount?: number
): MergedCategory {
  return {
    ...base,
    name: override?.name ?? base.name,
    description: override?.description ?? base.description,
    slug: override?.slug ?? base.slug,
    image: override?.image ?? base.image,
    parentId:
      override?.parentId !== undefined ? override.parentId : base.parentId ?? null,
    productCount: productCount ?? base.productCount,
    isActive: override?.isActive ?? true,
  };
}

function productTouchesCategory(p: MergedProduct, categoryId: string, all: Category[]): boolean {
  if (p.categoryIds.includes(categoryId) || p.subcategoryId === categoryId) return true;
  const expanded = expandCategoryIds([categoryId], all);
  return p.categoryIds.some((id) => expanded.includes(id));
}

export function mergeCategories(
  overrides: Record<string, CategoryOverride>,
  products: MergedProduct[],
  customCategories: CustomCategory[] = []
): MergedCategory[] {
  const customIds = new Set(customCategories.map((c) => c.id));
  const fromSeed = seedCategories
    .filter((c) => !customIds.has(c.id))
    .map((c) => {
      const mergedBase = mergeCategory(c, overrides[c.id]);
      return mergedBase;
    });
  const fromCustom = customCategories.map((c) => {
    const { isActive, createdAt: _c, ...rest } = c;
    void _c;
    const merged = mergeCategory(rest, overrides[c.id]);
    return { ...merged, isActive: overrides[c.id]?.isActive ?? isActive };
  });
  const all = [...fromCustom, ...fromSeed];
  return all.map((c) => {
    const count = products.filter(
      (p) => p.isActive !== false && productTouchesCategory(p, c.id, all)
    ).length;
    return { ...c, productCount: count };
  });
}

export function ensureOffersList(stored: Offer[] | undefined): Offer[] {
  if (stored?.length) {
    const ids = new Set(stored.map((o) => o.id));
    const missing = seedOffers.filter((o) => !ids.has(o.id));
    return missing.length ? [...stored, ...missing] : stored;
  }
  return seedOffers.map((o) => ({ ...o, productIds: [...o.productIds] }));
}

export function withOfferActive(offer: Offer & { isActive?: boolean }): MergedOffer {
  return { ...offer, isActive: offer.isActive !== false };
}

export function deriveCustomers(orders: Order[]): AdminCustomer[] {
  const map = new Map<string, AdminCustomer>();
  for (const o of orders) {
    const phone = (o.customer.phone || "").replace(/\s+/g, "");
    const key = phone || o.customer.name;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        id: key,
        name: o.customer.name,
        phone: o.customer.phone,
        orderCount: 1,
        totalSpent: o.status === "cancelled" ? 0 : o.total,
        lastOrderAt: o.createdAt,
        orders: [o],
      });
    } else {
      existing.orderCount += 1;
      if (o.status !== "cancelled") existing.totalSpent += o.total;
      existing.orders.push(o);
      if (
        !existing.lastOrderAt ||
        new Date(o.createdAt).getTime() > new Date(existing.lastOrderAt).getTime()
      ) {
        existing.lastOrderAt = o.createdAt;
        existing.name = o.customer.name;
      }
    }
  }
  const list = Array.from(map.values());
  for (const c of list) {
    c.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return list.sort(
    (a, b) =>
      (b.lastOrderAt ? new Date(b.lastOrderAt).getTime() : 0) -
      (a.lastOrderAt ? new Date(a.lastOrderAt).getTime() : 0)
  );
}

export function combineOrders(
  storeOrders: Order[],
  extraOrders: Order[]
): Order[] {
  const ids = new Set(storeOrders.map((o) => o.id));
  const extras = extraOrders.filter((o) => !ids.has(o.id));
  return [...storeOrders, ...extras].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function slugifyArabic(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .slice(0, 48);
  return base || `product-${Date.now().toString(36)}`;
}
