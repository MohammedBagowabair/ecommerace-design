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
  subcategoryId?: string | null;
  badges?: ProductBadge[];
  images?: string[];
  videos?: string[];
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
  parentId?: string | null;
};

export type StoreSettings = {
  storeName: string;
  whatsapp: string;
  whatsappDisplay: string;
  bankAccounts: BankAccount[];
  /** How many Yemeni Riyals (ر.ي) equal 1 Saudi Riyal (ر.س). 0/undefined = unset */
  yerPerSar?: number;
  /** Min business days for standard delivery */
  deliveryMinDays?: number;
  /** Max business days for standard delivery */
  deliveryMaxDays?: number;
  /** Short title shown on PDP trust row / checkout */
  deliveryLabel?: string;
  /** Longer helper text under the delivery label */
  deliveryText?: string;
  /** Enable free store pickup option */
  pickupEnabled?: boolean;
  /** Pickup option label */
  pickupLabel?: string;
  /** Pickup helper / ETA text */
  pickupText?: string;
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

/** Categories / subcategories created in admin */
export type CustomCategory = Category & {
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

export type AuditEntityType =
  | "order"
  | "product"
  | "category"
  | "offer"
  | "user"
  | "role"
  | "settings"
  | "auth"
  | "media"
  | "system";

export type ActivityEvent = {
  id: string;
  actorName: string;
  actorId?: string;
  action: string;
  /** Legacy display label for the target */
  target: string;
  entityType?: AuditEntityType;
  entityId?: string;
  before?: string;
  after?: string;
  createdAt: string;
  meta?: string;
  /** Mock client IP */
  ip?: string;
};

export type MergedProduct = Product & { isActive: boolean; isCustom?: boolean };
export type MergedCategory = Category & { isActive: boolean };
export type MergedOffer = Offer & { isActive: boolean };
