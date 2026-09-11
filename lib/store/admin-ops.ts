"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bankAccounts as seedBanks, storeContact } from "../data/checkout";
import { brand } from "../data";
import { adminExtraOrders } from "../admin/seed-ops-orders";
import { ensureOffersList } from "../admin/merged-catalog";
import { seedActivity, seedNotifications } from "../admin/seed-activity";
import type { Offer, Order, OrderStatus, Product } from "../types";
import type {
  ActivityEvent,
  AdminNotification,
  CategoryOverride,
  CustomCategory,
  CustomProduct,
  ProductOverride,
  StoreSettings,
} from "../admin/ops-types";
import { normalizeOrderStatus } from "../order-status";

const defaultSettings = (): StoreSettings => ({
  storeName: brand.name,
  whatsapp: storeContact.whatsapp,
  whatsappDisplay: storeContact.whatsappDisplay,
  bankAccounts: seedBanks.map((b) => ({ ...b })),
  yerPerSar: 150, // illustrative mock default: 1 SAR ≈ 150 YER
  deliveryMinDays: 2,
  deliveryMaxDays: 5,
  deliveryLabel: "التوصيل إلى عنوانك",
  deliveryText: "خلال أيام العمل المحددة · يمكن ضبط المدة من الإعدادات",
  pickupEnabled: true,
  pickupLabel: "استلام من المتجر",
  pickupText: "مجاني · جاهز خلال وقت قصير بعد تأكيد الطلب",
});

interface AdminOpsState {
  hydrated: boolean;
  productOverrides: Record<string, ProductOverride>;
  categoryOverrides: Record<string, CategoryOverride>;
  customCategories: CustomCategory[];
  customProducts: CustomProduct[];
  offers: Offer[];
  offersSeeded: boolean;
  settings: StoreSettings;
  settingsSeeded: boolean;
  extraOrders: Order[];
  extraOrdersSeeded: boolean;
  notifications: AdminNotification[];
  notificationsSeeded: boolean;
  activity: ActivityEvent[];
  activitySeeded: boolean;
  setHydrated: (v: boolean) => void;
  ensureSeeded: () => void;
  setProductOverride: (id: string, patch: ProductOverride) => void;
  clearProductOverride: (id: string) => void;
  bulkSetProductActive: (ids: string[], isActive: boolean) => void;
  addCustomProduct: (product: Omit<CustomProduct, "createdAt">) => string;
  updateCustomProduct: (id: string, patch: Partial<CustomProduct>) => void;
  deleteCustomProduct: (id: string) => void;
  setCategoryOverride: (id: string, patch: CategoryOverride) => void;
  addCustomCategory: (cat: Omit<CustomCategory, "createdAt">) => string;
  updateCustomCategory: (id: string, patch: Partial<CustomCategory>) => void;
  deleteCustomCategory: (id: string) => boolean;
  upsertOffer: (offer: Offer) => void;
  deleteOffer: (id: string) => void;
  setOfferActive: (id: string, isActive: boolean) => void;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  resetSettings: () => void;
  updateExtraOrderStatus: (id: string, status: OrderStatus, notes?: string) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addActivity: (event: Omit<ActivityEvent, "id" | "createdAt"> & { id?: string; createdAt?: string }) => void;
}

function newOfferId(): string {
  return `offer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function newProductId(): string {
  return `cprod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function newActivityId(): string {
  return `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function mockClientIp(): string {
  // Deterministic-ish mock IP for audit display
  const n = Math.floor(Math.random() * 200) + 20;
  return `185.12.${n}.${Math.floor(Math.random() * 250) + 1}`;
}

export { newOfferId, newProductId };

export const useAdminOpsStore = create<AdminOpsState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      productOverrides: {},
      categoryOverrides: {},
      customCategories: [],
      customProducts: [],
      offers: [],
      offersSeeded: false,
      settings: defaultSettings(),
      settingsSeeded: false,
      extraOrders: [],
      extraOrdersSeeded: false,
      notifications: [],
      notificationsSeeded: false,
      activity: [],
      activitySeeded: false,
      setHydrated: (v) => set({ hydrated: v }),
      ensureSeeded: () => {
        const s = get();
        const next: Partial<AdminOpsState> = {};
        if (!s.offersSeeded || !s.offers.length) {
          next.offers = ensureOffersList(s.offers);
          next.offersSeeded = true;
        } else {
          next.offers = ensureOffersList(s.offers);
        }
        if (!s.settingsSeeded) {
          next.settings = {
            ...defaultSettings(),
            ...s.settings,
            yerPerSar:
              s.settings.yerPerSar && s.settings.yerPerSar > 0
                ? s.settings.yerPerSar
                : defaultSettings().yerPerSar,
            bankAccounts:
              s.settings.bankAccounts?.length > 0
                ? s.settings.bankAccounts
                : defaultSettings().bankAccounts,
          };
          next.settingsSeeded = true;
        } else if (s.settings) {
          const d = defaultSettings();
          const needsFx = !(s.settings.yerPerSar && s.settings.yerPerSar > 0);
          const needsDelivery =
            !s.settings.deliveryMinDays ||
            !s.settings.deliveryMaxDays ||
            !s.settings.deliveryLabel;
          if (needsFx || needsDelivery) {
            next.settings = {
              ...d,
              ...s.settings,
              yerPerSar: needsFx ? d.yerPerSar : s.settings.yerPerSar,
              deliveryMinDays: s.settings.deliveryMinDays ?? d.deliveryMinDays,
              deliveryMaxDays: s.settings.deliveryMaxDays ?? d.deliveryMaxDays,
              deliveryLabel: s.settings.deliveryLabel ?? d.deliveryLabel,
              deliveryText: s.settings.deliveryText ?? d.deliveryText,
              pickupEnabled: s.settings.pickupEnabled ?? d.pickupEnabled,
              pickupLabel: s.settings.pickupLabel ?? d.pickupLabel,
              pickupText: s.settings.pickupText ?? d.pickupText,
            };
          }
        }
        if (!s.extraOrdersSeeded || !s.extraOrders.length) {
          const ids = new Set(s.extraOrders.map((o) => o.id));
          const missing = adminExtraOrders.filter((o) => !ids.has(o.id));
          const mappedMissing = missing.map((o) => ({
            ...o,
            status: normalizeOrderStatus(o.status as string),
            items: o.items.map((i) => ({ ...i })),
            customer: { ...o.customer },
            address: { ...o.address },
          }));
          next.extraOrders =
            s.extraOrders.length > 0
              ? [
                  ...s.extraOrders.map((o) => ({
                    ...o,
                    status: normalizeOrderStatus(o.status as string),
                  })),
                  ...mappedMissing,
                ]
              : adminExtraOrders.map((o) => ({
                  ...o,
                  status: normalizeOrderStatus(o.status as string),
                  items: o.items.map((i) => ({ ...i })),
                  customer: { ...o.customer },
                  address: { ...o.address },
                }));
          next.extraOrdersSeeded = true;
        } else if (s.extraOrders.length) {
          next.extraOrders = s.extraOrders.map((o) => ({
            ...o,
            status: normalizeOrderStatus(o.status as string),
          }));
        }
        if (!s.notificationsSeeded || !s.notifications.length) {
          const ids = new Set(s.notifications.map((n) => n.id));
          const missing = seedNotifications.filter((n) => !ids.has(n.id));
          next.notifications =
            s.notifications.length > 0
              ? [...s.notifications, ...missing]
              : seedNotifications.map((n) => ({ ...n }));
          next.notificationsSeeded = true;
        }
        if (!s.activitySeeded || !s.activity.length) {
          const ids = new Set(s.activity.map((a) => a.id));
          const missing = seedActivity.filter((a) => !ids.has(a.id));
          next.activity =
            s.activity.length > 0
              ? [...s.activity, ...missing].sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
              : seedActivity.map((a) => ({ ...a }));
          next.activitySeeded = true;
        }
        if (Object.keys(next).length) set(next);
      },
      setProductOverride: (id, patch) =>
        set((s) => ({
          productOverrides: {
            ...s.productOverrides,
            [id]: { ...s.productOverrides[id], ...patch },
          },
        })),
      clearProductOverride: (id) =>
        set((s) => {
          const next = { ...s.productOverrides };
          delete next[id];
          return { productOverrides: next };
        }),
      bulkSetProductActive: (ids, isActive) =>
        set((s) => {
          const productOverrides = { ...s.productOverrides };
          for (const id of ids) {
            productOverrides[id] = { ...productOverrides[id], isActive };
          }
          const customProducts = s.customProducts.map((p) =>
            ids.includes(p.id) ? { ...p, isActive } : p
          );
          return { productOverrides, customProducts };
        }),
      addCustomProduct: (product) => {
        const id = product.id || newProductId();
        const entry: CustomProduct = {
          ...product,
          id,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ customProducts: [entry, ...s.customProducts] }));
        return id;
      },
      updateCustomProduct: (id, patch) =>
        set((s) => ({
          customProducts: s.customProducts.map((p) =>
            p.id === id ? { ...p, ...patch, id: p.id } : p
          ),
        })),
      deleteCustomProduct: (id) =>
        set((s) => {
          const nextOverrides = { ...s.productOverrides };
          delete nextOverrides[id];
          return {
            customProducts: s.customProducts.filter((p) => p.id !== id),
            productOverrides: nextOverrides,
          };
        }),
      setCategoryOverride: (id, patch) =>
        set((s) => ({
          categoryOverrides: {
            ...s.categoryOverrides,
            [id]: { ...s.categoryOverrides[id], ...patch },
          },
        })),
      addCustomCategory: (cat) => {
        const id = cat.id || `ccat-${Date.now().toString(36)}`;
        const entry: CustomCategory = {
          ...cat,
          id,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ customCategories: [entry, ...s.customCategories] }));
        return id;
      },
      updateCustomCategory: (id, patch) =>
        set((s) => ({
          customCategories: s.customCategories.map((c) =>
            c.id === id ? { ...c, ...patch, id: c.id } : c
          ),
        })),
      deleteCustomCategory: (id) => {
        const { customCategories } = get();
        const target = customCategories.find((c) => c.id === id);
        if (!target) return false;
        const hasChildren = customCategories.some((c) => c.parentId === id);
        if (hasChildren) return false;
        set((s) => {
          const nextOverrides = { ...s.categoryOverrides };
          delete nextOverrides[id];
          return {
            customCategories: s.customCategories.filter((c) => c.id !== id),
            categoryOverrides: nextOverrides,
          };
        });
        return true;
      },
      upsertOffer: (offer) =>
        set((s) => {
          const idx = s.offers.findIndex((o) => o.id === offer.id);
          if (idx >= 0) {
            const offers = [...s.offers];
            offers[idx] = offer;
            return { offers };
          }
          return { offers: [offer, ...s.offers] };
        }),
      deleteOffer: (id) =>
        set((s) => ({ offers: s.offers.filter((o) => o.id !== id) })),
      setOfferActive: (id, isActive) =>
        set((s) => ({
          offers: s.offers.map((o) =>
            o.id === id ? { ...o, isActive } : o
          ),
        })),
      updateSettings: (patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            ...patch,
            bankAccounts: patch.bankAccounts ?? s.settings.bankAccounts,
          },
        })),
      resetSettings: () => set({ settings: defaultSettings(), settingsSeeded: true }),
      updateExtraOrderStatus: (id, status, notes) => {
        const exists = get().extraOrders.some((o) => o.id === id);
        if (!exists) return false;
        set((s) => ({
          extraOrders: s.extraOrders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  ...(notes !== undefined ? { notes } : {}),
                }
              : o
          ),
        }));
        return true;
      },
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),
      addActivity: (event) => {
        const entry: ActivityEvent = {
          id: event.id ?? newActivityId(),
          createdAt: event.createdAt ?? new Date().toISOString(),
          actorName: event.actorName,
          actorId: event.actorId,
          action: event.action,
          target: event.target,
          entityType: event.entityType,
          entityId: event.entityId,
          before: event.before,
          after: event.after,
          meta: event.meta,
          ip: event.ip ?? mockClientIp(),
        };
        set((s) => ({ activity: [entry, ...s.activity] }));
      },
    }),
    {
      name: "naqshat-admin-ops",
      partialize: (s) => ({
        productOverrides: s.productOverrides,
        categoryOverrides: s.categoryOverrides,
        customCategories: s.customCategories,
        customProducts: s.customProducts,
        offers: s.offers,
        offersSeeded: s.offersSeeded,
        settings: s.settings,
        settingsSeeded: s.settingsSeeded,
        extraOrders: s.extraOrders,
        extraOrdersSeeded: s.extraOrdersSeeded,
        notifications: s.notifications,
        notificationsSeeded: s.notificationsSeeded,
        activity: s.activity,
        activitySeeded: s.activitySeeded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.ensureSeeded();
      },
    }
  )
);

/** Helper to build a blank custom product shell */
export function blankCustomProduct(
  partial: Partial<Product> & { name: string; price: number }
): Omit<CustomProduct, "createdAt"> {
  const id = partial.id || newProductId();
  return {
    id,
    slug: partial.slug || `custom-${id}`,
    name: partial.name,
    description: partial.description || "",
    price: partial.price,
    compareAtPrice: partial.compareAtPrice,
    categoryIds: partial.categoryIds || [],
    images: partial.images?.length
      ? partial.images
      : [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        ],
    videos: partial.videos,
    subcategoryId: partial.subcategoryId,
    badges: partial.badges || [],
    rating: 0,
    reviewCount: 0,
    stock: partial.stock ?? 10,
    stockStatus: partial.stockStatus || "in_stock",
    sku: partial.sku || `NQ-C-${Date.now().toString(36).toUpperCase()}`,
    tags: partial.tags || ["مخصص"],
    isOffer: partial.isOffer,
    isNew: partial.isNew ?? true,
    isFeatured: partial.isFeatured,
    isBestseller: partial.isBestseller,
    occasion: partial.occasion,
    patternType: partial.patternType,
    isActive: true,
  };
}
