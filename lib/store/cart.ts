"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "../types";

interface CartState {
  items: CartItem[];
  /** Returns true if item was added/updated; false if blocked (e.g. out of stock). */
  addItem: (productId: string, quantity?: number, maxStock?: number) => boolean;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock?: number) => void;
  clear: () => void;
  getCount: () => number;
  getQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1, maxStock) => {
        if (maxStock !== undefined && maxStock <= 0) return false;
        const current = get().getQuantity(productId);
        const nextQty = current + quantity;
        if (maxStock !== undefined && nextQty > maxStock) {
          if (current >= maxStock) return false;
          set((state) => {
            const existing = state.items.find((i) => i.productId === productId);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: maxStock } : i
                ),
              };
            }
            return { items: [...state.items, { productId, quantity: maxStock }] };
          });
          return true;
        }
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        });
        return true;
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity, maxStock) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          let q = quantity;
          if (maxStock !== undefined) q = Math.min(quantity, Math.max(0, maxStock));
          if (q <= 0) {
            return { items: state.items.filter((i) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: q } : i
            ),
          };
        }),
      clear: () => set({ items: [] }),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getQuantity: (productId) =>
        get().items.find((i) => i.productId === productId)?.quantity ?? 0,
    }),
    { name: "naqshat-cart" }
  )
);
