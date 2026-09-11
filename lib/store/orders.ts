"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "../types";
import { seedOrders } from "../data/seed-orders";
import { normalizeOrderStatus } from "../order-status";

interface OrdersState {
  orders: Order[];
  /** Whether seed demo orders have been merged at least once */
  seedsMerged: boolean;
  addOrder: (order: Order) => void;
  getOrderById: (id: string) => Order | undefined;
  getNextOrderId: () => string;
  ensureSeeds: () => void;
  updateOrderStatus: (id: string, status: OrderStatus, notes?: string) => boolean;
  upsertOrder: (order: Order) => void;
}

function padSeq(n: number): string {
  return String(n).padStart(5, "0");
}

function normalizeOrders(orders: Order[]): Order[] {
  return orders.map((o) => ({
    ...o,
    status: normalizeOrderStatus(o.status as string),
  }));
}

function mergeSeeds(orders: Order[]): Order[] {
  const normalized = normalizeOrders(orders);
  const ids = new Set(normalized.map((o) => o.id));
  const missing = seedOrders.filter((o) => !ids.has(o.id));
  if (!missing.length) return normalized;
  return [...normalized, ...missing].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      seedsMerged: false,
      addOrder: (order) =>
        set((s) => ({
          orders: [order, ...s.orders],
        })),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
      getNextOrderId: () => {
        const year = new Date().getFullYear();
        const prefix = `ORD-${year}-`;
        const seqs = get()
          .orders.filter((o) => o.id.startsWith(prefix))
          .map((o) => {
            const part = o.id.slice(prefix.length);
            const n = parseInt(part, 10);
            return Number.isFinite(n) ? n : 0;
          });
        const next = (seqs.length ? Math.max(...seqs) : 124) + 1;
        return `${prefix}${padSeq(next)}`;
      },
      ensureSeeds: () => {
        const { seedsMerged, orders } = get();
        if (seedsMerged) {
          const merged = mergeSeeds(orders);
          if (merged.length !== orders.length) {
            set({ orders: merged });
          }
          return;
        }
        set({ orders: mergeSeeds(orders), seedsMerged: true });
      },
      updateOrderStatus: (id, status, notes) => {
        const exists = get().orders.some((o) => o.id === id);
        if (!exists) return false;
        set((s) => ({
          orders: s.orders.map((o) =>
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
      upsertOrder: (order) =>
        set((s) => {
          const idx = s.orders.findIndex((o) => o.id === order.id);
          if (idx >= 0) {
            const orders = [...s.orders];
            orders[idx] = order;
            return { orders };
          }
          return { orders: [order, ...s.orders] };
        }),
    }),
    {
      name: "naqshat-orders",
      onRehydrateStorage: () => (state) => {
        state?.ensureSeeds();
      },
    }
  )
);
