"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const has = get().ids.includes(productId);
        if (has) {
          set((s) => ({ ids: s.ids.filter((id) => id !== productId) }));
          return false;
        }
        set((s) => ({ ids: [...s.ids, productId] }));
        return true;
      },
      add: (productId) =>
        set((s) =>
          s.ids.includes(productId) ? s : { ids: [...s.ids, productId] }
        ),
      remove: (productId) =>
        set((s) => ({ ids: s.ids.filter((id) => id !== productId) })),
      has: (productId) => get().ids.includes(productId),
      getCount: () => get().ids.length,
    }),
    { name: "naqshat-wishlist" }
  )
);
