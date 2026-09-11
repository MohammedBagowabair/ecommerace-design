"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedState {
  ids: string[];
  add: (productId: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      add: (productId) =>
        set((s) => {
          const filtered = s.ids.filter((id) => id !== productId);
          return { ids: [productId, ...filtered].slice(0, 12) };
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: "naqshat-recently-viewed" }
  )
);
