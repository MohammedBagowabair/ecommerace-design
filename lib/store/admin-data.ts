"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminRole, AdminUser, AdminUserStatus, Permission } from "../admin/types";
import { seedAdminUsers, seedRoles } from "../admin/seed";

interface AdminDataState {
  users: AdminUser[];
  roles: AdminRole[];
  seeded: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  ensureSeeded: () => void;
  getUserById: (id: string) => AdminUser | undefined;
  getRoleById: (id: string) => AdminRole | undefined;
  getRoleBySlug: (slug: string) => AdminRole | undefined;
  createUser: (input: Omit<AdminUser, "id" | "createdAt" | "lastLoginAt">) => string;
  updateUser: (id: string, patch: Partial<Omit<AdminUser, "id" | "createdAt">>) => void;
  setUserStatus: (id: string, status: AdminUserStatus) => { ok: true } | { ok: false; error: string };
  deleteUser: (id: string) => { ok: true } | { ok: false; error: string };
  touchLastLogin: (id: string) => void;
  updateRole: (id: string, patch: { name?: string; description?: string; permissions?: Permission[] }) => void;
  createRole: (input: Omit<AdminRole, "id" | "isSystem">) => string;
  deleteRole: (id: string) => { ok: true } | { ok: false; error: string };
  countUsersByRole: (roleId: string) => number;
}

function newUserId(): string {
  return `au-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function newRoleId(): string {
  return `role-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function isLastActiveSuperAdmin(users: AdminUser[], roles: AdminRole[], userId: string): boolean {
  const superRole = roles.find((r) => r.slug === "super_admin");
  if (!superRole) return false;
  const user = users.find((u) => u.id === userId);
  if (!user || user.roleId !== superRole.id) return false;
  const activeSupers = users.filter(
    (u) => u.roleId === superRole.id && u.status === "active"
  );
  return activeSupers.length <= 1;
}

export const useAdminDataStore = create<AdminDataState>()(
  persist(
    (set, get) => ({
      users: [],
      roles: [],
      seeded: false,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      ensureSeeded: () => {
        const s = get();
        if (s.seeded && s.users.length && s.roles.length) return;
        const roleIds = new Set(s.roles.map((r) => r.id));
        const mergedRoles = [
          ...s.roles,
          ...seedRoles.filter((r) => !roleIds.has(r.id)),
        ];
        const roles = mergedRoles.map((r) => {
          if (r.isSystem) {
            const seed = seedRoles.find((x) => x.id === r.id);
            if (seed && (!r.permissions?.length || r.slug !== seed.slug)) {
              return { ...seed, permissions: r.permissions?.length ? r.permissions : seed.permissions };
            }
          }
          return r;
        });
        const finalRoles = roles.length ? roles : [...seedRoles];

        const userIds = new Set(s.users.map((u) => u.id));
        const users =
          s.users.length > 0
            ? [
                ...s.users,
                ...seedAdminUsers.filter((u) => !userIds.has(u.id)),
              ]
            : seedAdminUsers.map((u) => ({ ...u }));

        set({ users, roles: finalRoles, seeded: true });
      },
      getUserById: (id) => get().users.find((u) => u.id === id),
      getRoleById: (id) => get().roles.find((r) => r.id === id),
      getRoleBySlug: (slug) => get().roles.find((r) => r.slug === slug),
      createUser: (input) => {
        const id = newUserId();
        const user: AdminUser = {
          ...input,
          id,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        };
        set((s) => ({ users: [user, ...s.users] }));
        return id;
      },
      updateUser: (id, patch) => {
        const s = get();
        if (patch.roleId !== undefined || patch.status === "disabled") {
          const user = s.users.find((u) => u.id === id);
          const superRole = s.roles.find((r) => r.slug === "super_admin");
          if (
            user &&
            superRole &&
            user.roleId === superRole.id &&
            user.status === "active"
          ) {
            if (patch.status === "disabled" || (patch.roleId && patch.roleId !== superRole.id)) {
              if (isLastActiveSuperAdmin(s.users, s.roles, id)) {
                return; // silent no-op; callers should use setUserStatus/deleteUser for errors
              }
            }
          }
        }
        set((st) => ({
          users: st.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        }));
      },
      setUserStatus: (id, status) => {
        const s = get();
        if (status === "disabled" && isLastActiveSuperAdmin(s.users, s.roles, id)) {
          return { ok: false, error: "لا يمكن تعطيل آخر مدير أعلى نشط" };
        }
        set((st) => ({
          users: st.users.map((u) => (u.id === id ? { ...u, status } : u)),
        }));
        return { ok: true };
      },
      deleteUser: (id) => {
        const s = get();
        if (isLastActiveSuperAdmin(s.users, s.roles, id)) {
          return { ok: false, error: "لا يمكن حذف آخر مدير أعلى نشط" };
        }
        set((st) => ({ users: st.users.filter((u) => u.id !== id) }));
        return { ok: true };
      },
      touchLastLogin: (id) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id ? { ...u, lastLoginAt: new Date().toISOString() } : u
          ),
        })),
      updateRole: (id, patch) =>
        set((s) => ({
          roles: s.roles.map((r) =>
            r.id === id
              ? {
                  ...r,
                  ...(patch.name !== undefined ? { name: patch.name } : {}),
                  ...(patch.description !== undefined
                    ? { description: patch.description }
                    : {}),
                  ...(patch.permissions !== undefined
                    ? { permissions: patch.permissions }
                    : {}),
                }
              : r
          ),
        })),
      createRole: (input) => {
        const id = newRoleId();
        const role: AdminRole = { ...input, id, isSystem: false };
        set((s) => ({ roles: [...s.roles, role] }));
        return id;
      },
      deleteRole: (id) => {
        const s = get();
        const role = s.roles.find((r) => r.id === id);
        if (!role) return { ok: false, error: "الدور غير موجود" };
        if (role.isSystem) return { ok: false, error: "لا يمكن حذف أدوار النظام" };
        if (s.users.some((u) => u.roleId === id)) {
          return { ok: false, error: "لا يمكن حذف دور مرتبط بمستخدمين" };
        }
        set((st) => ({ roles: st.roles.filter((r) => r.id !== id) }));
        return { ok: true };
      },
      countUsersByRole: (roleId) =>
        get().users.filter((u) => u.roleId === roleId).length,
    }),
    {
      name: "naqshat-admin-data",
      partialize: (s) => ({
        users: s.users,
        roles: s.roles,
        seeded: s.seeded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        state?.ensureSeeded();
      },
    }
  )
);
