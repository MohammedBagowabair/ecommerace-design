import type {
  BankAccount,
  Category,
  Offer,
  Order,
  Product,
  ProductBadge,
  StockStatus,
} from "../types";

/** Editable product fields persisted as overrides (does not mutate seed products.ts) */
export type ProductOverride = {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number | null;
  stock?: number;
  stockStatus?: StockStatus;
  categoryIds?: string[];
  badges?: ProductBadge[];
  images?: string[];
  isFeatured?: boolean;
  isOffer?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  /** Soft-hide from storefront when merge layer applied; admin still lists it */
  isActive?: boolean;
};

export type CategoryOverride = {
  name?: string;
  description?: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
};

export type StoreSettings = {
  storeName: string;
  whatsapp: string;
  whatsappDisplay: string;
  bankAccounts: BankAccount[];
};

export type AdminCustomer = {
  id: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  orders: Order[];
};

/** Products created in admin (not in seed file) — admin catalog only */
export type CustomProduct = Product & {
  isActive: boolean;
  createdAt: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
  type: "order" | "stock" | "system" | "payment";
};

export type ActivityEvent = {
  id: string;
  actorName: string;
  action: string;
  target: string;
  createdAt: string;
  meta?: string;
};

export type MergedProduct = Product & { isActive: boolean; isCustom?: boolean };
export type MergedCategory = Category & { isActive: boolean };
export type MergedOffer = Offer & { isActive: boolean };
