export type ProductBadge = "new" | "featured" | "bestseller" | "discount" | "limited";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryIds: string[];
  images: string[];
  badges: ProductBadge[];
  rating: number;
  reviewCount: number;
  stock: number;
  stockStatus: StockStatus;
  sku: string;
  tags: string[];
  isOffer?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  occasion?: string;
  patternType?: string;
  info?: Record<string, string>;
  isStub?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  /** Optional review photos (URLs or data URLs) */
  images?: string[];
}

/** User-submitted review persisted in localStorage */
export interface UserReview extends Review {
  orderId: string;
  productName: string;
  productImage: string;
  productSlug?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  discountPercent: number;
  endsAt?: string;
  image?: string;
  /** Short marketing chip, e.g. عروس · عيد */
  badge?: string;
  /** Optional deep-link override */
  href?: string;
  /** Admin soft-disable; storefront ignores when undefined/true */
  isActive?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "bestseller";

export interface ProductFilters {
  categories: string[];
  patternTypes: string[];
  occasions: string[];
  priceMin?: number;
  priceMax?: number;
  inStockOnly?: boolean;
  minRating?: number;
  onSaleOnly?: boolean;
  sort: SortOption;
}

export type AddressLabel = "home" | "work";

export type DeliveryMethodId = "standard" | "pickup";

export type PaymentMethodId = "bank_transfer";

/** Full fulfillment + payment journey (mock) */
export type OrderStatus =
  | "pending_payment"
  | "payment_review"
  | "payment_confirmed"
  | "preparing"
  | "ready_for_delivery"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/** Derived payment view for order lists */
export type PaymentStatus = "pending" | "reviewing" | "confirmed" | "cancelled";

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
}

export interface Address {
  id: string;
  label: AddressLabel;
  governorate: string;
  city: string;
  area: string;
  street: string;
  details?: string;
  phone: string;
  /** Optional free-text geo / map pin */
  geo?: string;
}

export interface DeliveryOption {
  id: DeliveryMethodId;
  name: string;
  description: string;
  fee: number;
  eta: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  iban?: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerInfo;
  address: Address;
  deliveryMethodId: DeliveryMethodId;
  deliveryFee: number;
  paymentMethodId: PaymentMethodId;
  bankAccountId: string;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: "YER";
  notes?: string;
  /** True for demo seed orders */
  isSeed?: boolean;
}
