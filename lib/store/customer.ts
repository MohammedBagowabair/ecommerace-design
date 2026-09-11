"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, CustomerProfile } from "../types";
import { mockSavedAddresses } from "../data/checkout";

const defaultProfile: CustomerProfile = {
  name: "سارة أحمد",
  phone: "777123456",
  email: "sara@example.com",
};

interface CustomerState {
  profile: CustomerProfile;
  addresses: Address[];
  updateProfile: (profile: CustomerProfile) => void;
  addAddress: (address: Omit<Address, "id">) => string;
  updateAddress: (id: string, patch: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  getAddressById: (id: string) => Address | undefined;
}

function newAddressId(): string {
  return `addr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      addresses: mockSavedAddresses.map((a) => ({ ...a })),
      updateProfile: (profile) => set({ profile }),
      addAddress: (address) => {
        const id = newAddressId();
        set((s) => ({ addresses: [...s.addresses, { ...address, id }] }));
        return id;
      },
      updateAddress: (id, patch) =>
        set((s) => ({
          addresses: s.addresses.map((a) =>
            a.id === id ? { ...patch, id } : a
          ),
        })),
      removeAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.filter((a) => a.id !== id),
        })),
      getAddressById: (id) => get().addresses.find((a) => a.id === id),
    }),
    { name: "naqshat-customer" }
  )
);
