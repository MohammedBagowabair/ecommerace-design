"use client";

import { useEffect, useMemo } from "react";
import { combineOrders } from "./merged-catalog";
import { useOrdersStore } from "../store/orders";
import { useAdminOpsStore } from "../store/admin-ops";
import type { Order, OrderStatus } from "../types";

export function useAdminOrders(): {
  orders: Order[];
  hydrated: boolean;
  updateStatus: (id: string, status: OrderStatus, notes?: string) => void;
  getById: (id: string) => Order | undefined;
} {
  const storeOrders = useOrdersStore((s) => s.orders);
  const ensureSeeds = useOrdersStore((s) => s.ensureSeeds);
  const updateStoreStatus = useOrdersStore((s) => s.updateOrderStatus);

  const extraOrders = useAdminOpsStore((s) => s.extraOrders);
  const ensureOps = useAdminOpsStore((s) => s.ensureSeeded);
  const updateExtra = useAdminOpsStore((s) => s.updateExtraOrderStatus);
  const opsHydrated = useAdminOpsStore((s) => s.hydrated);

  useEffect(() => {
    ensureSeeds();
    ensureOps();
    const t = window.setTimeout(() => {
      if (!useAdminOpsStore.getState().hydrated) {
        useAdminOpsStore.getState().setHydrated(true);
        useAdminOpsStore.getState().ensureSeeded();
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [ensureSeeds, ensureOps]);

  const orders = useMemo(
    () => combineOrders(storeOrders, extraOrders),
    [storeOrders, extraOrders]
  );

  return {
    orders,
    hydrated: opsHydrated || storeOrders.length > 0,
    getById: (id) => orders.find((o) => o.id === id),
    updateStatus: (id, status, notes) => {
      if (!updateStoreStatus(id, status, notes)) {
        updateExtra(id, status, notes);
      }
    },
  };
}
