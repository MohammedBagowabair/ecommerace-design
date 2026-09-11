"use client";

import { create } from "zustand";

interface UIState {
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  searchOverlayOpen: boolean;
  openSearchOverlay: () => void;
  closeSearchOverlay: () => void;
  toggleSearchOverlay: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartDrawerOpen: false,
  openCartDrawer: () => set({ cartDrawerOpen: true, searchOverlayOpen: false }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer: () =>
    set((s) => ({
      cartDrawerOpen: !s.cartDrawerOpen,
      searchOverlayOpen: s.cartDrawerOpen ? s.searchOverlayOpen : false,
    })),
  searchOverlayOpen: false,
  openSearchOverlay: () => set({ searchOverlayOpen: true, cartDrawerOpen: false }),
  closeSearchOverlay: () => set({ searchOverlayOpen: false }),
  toggleSearchOverlay: () =>
    set((s) => ({
      searchOverlayOpen: !s.searchOverlayOpen,
      cartDrawerOpen: s.searchOverlayOpen ? s.cartDrawerOpen : false,
    })),
}));
