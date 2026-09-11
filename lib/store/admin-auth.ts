"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminSession, Permission } from "../admin/types";
import { seedAdminUsers, seedRoles } from "../admin/seed";
import { useAdminDataStore } from "./admin-data";

interface AdminAuthState {
  session: AdminSession | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  refreshSessionFromUser: (userId: string) => void;
  hasPermission: (perm: Permission | Permission[]) => boolean;
}

function buildSession(
  user: { id: string; email: string; name: string; roleId: string },
  role: { slug: string; permissions: Permission[] }
): AdminSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId,
    roleSlug: role.slug,
    permissions: [...role.permissions],
    loggedInAt: new Date().toISOString(),
  };
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      session: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      login: (email, password) => {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed || !password.trim()) {
          return { ok: false, error: "أدخلي البريد وكلمة المرور" };
        }

        // Ensure data store is seeded
        useAdminDataStore.getState().ensureSeeded();
        const { users, roles } = useAdminDataStore.getState();

        const existing = users.find((u) => u.email.toLowerCase() === trimmed);
        if (existing) {
          if (existing.status === "disabled") {
            return { ok: false, error: "هذا الحساب معطّل. تواصلي مع المدير." };
          }
          const role = roles.find((r) => r.id === existing.roleId) ?? seedRoles[0];
          useAdminDataStore.getState().touchLastLogin(existing.id);
          set({ session: buildSession(existing, role) });
          return { ok: true };
        }

        // Any other credentials → guest admin session (mock) as admin role
        const guestRole = roles.find((r) => r.slug === "admin") ?? seedRoles[1];
        const guest = {
          id: `guest-${Date.now().toString(36)}`,
          email: trimmed,
          name: trimmed.split("@")[0] || "ضيف إداري",
          roleId: guestRole.id,
        };
        set({ session: buildSession(guest, guestRole) });
        return { ok: true };
      },
      logout: () => set({ session: null }),
      refreshSessionFromUser: (userId) => {
        const { users, roles } = useAdminDataStore.getState();
        const user = users.find((u) => u.id === userId);
        const session = get().session;
        if (!user || !session || session.userId !== userId) return;
        const role = roles.find((r) => r.id === user.roleId);
        if (!role) return;
        set({
          session: {
            ...session,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            roleSlug: role.slug,
            permissions: [...role.permissions],
          },
        });
      },
      hasPermission: (perm) => {
        const perms = get().session?.permissions ?? [];
        const list = Array.isArray(perm) ? perm : [perm];
        return list.every((p) => perms.includes(p));
      },
    }),
    {
      name: "naqshat-admin-auth",
      partialize: (s) => ({ session: s.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        // Fallback seed users for matching during login if data store empty
        void seedAdminUsers;
      },
    }
  )
);

/** Call once on client to mark hydrated if persist skipped */
export function ensureAdminAuthHydrated() {
  if (typeof window === "undefined") return;
  const s = useAdminAuthStore.getState();
  if (!s.hydrated) {
    // Persist may already have finished before listener attached
    queueMicrotask(() => {
      if (!useAdminAuthStore.getState().hydrated) {
        useAdminAuthStore.getState().setHydrated(true);
      }
    });
  }
}
