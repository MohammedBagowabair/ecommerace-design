"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCustomerStore } from "./customer";

export type AuthProvider = "local" | "google";

export interface CustomerSession {
  userId: string;
  name: string;
  phone: string;
  email: string;
  provider: AuthProvider;
  loggedInAt: string;
}

export interface MockCustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  /** Plaintext mock password — local accounts only */
  password: string;
  provider: AuthProvider;
  createdAt: string;
}

interface CustomerAuthState {
  session: CustomerSession | null;
  users: MockCustomerUser[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  register: (
    input: {
      name: string;
      phone: string;
      email?: string;
      password: string;
    },
    options?: { autoLogin?: boolean }
  ) =>
    | { ok: true; userId: string; contact: string }
    | { ok: false; error: string };
  login: (
    identifier: string,
    password: string
  ) => { ok: true } | { ok: false; error: string };
  loginWithGoogle: () => { ok: true };
  activateSession: (
    userId: string
  ) => { ok: true } | { ok: false; error: string };
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => { ok: true } | { ok: false; error: string };
  resetPassword: (
    identifier: string,
    newPassword: string
  ) => { ok: true } | { ok: false; error: string };
  findUserByIdentifier: (identifier: string) => MockCustomerUser | undefined;
  logout: () => void;
  isLoggedIn: () => boolean;
}

function newUserId(): string {
  return `cust-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, "");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function syncProfile(session: CustomerSession) {
  try {
    useCustomerStore.getState().updateProfile({
      name: session.name,
      phone: session.phone,
      email: session.email,
    });
  } catch {
    /* store may not be ready */
  }
}

function sessionFromUser(user: MockCustomerUser): CustomerSession {
  return {
    userId: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    provider: user.provider,
    loggedInAt: new Date().toISOString(),
  };
}

function matchIdentifier(user: MockCustomerUser, identifier: string): boolean {
  const id = identifier.trim();
  if (!id) return false;
  const idLower = id.toLowerCase();
  const idPhone = normalizePhone(id);
  const emailMatch = !!user.email && normalizeEmail(user.email) === idLower;
  const phoneMatch = normalizePhone(user.phone) === idPhone;
  return emailMatch || phoneMatch;
}

const DEMO_USER: MockCustomerUser = {
  id: "cust-demo-sara",
  name: "سارة أحمد",
  phone: "777123456",
  email: "sara@example.com",
  password: "demo123",
  provider: "local",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      session: null,
      users: [DEMO_USER],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      register: ({ name, phone, email, password }, options) => {
        const autoLogin = options?.autoLogin !== false;
        const trimmedName = name.trim();
        const phoneNorm = normalizePhone(phone);
        const emailNorm = email?.trim() ? normalizeEmail(email) : "";

        if (trimmedName.length < 2) {
          return { ok: false, error: "أدخلي الاسم (حرفان على الأقل)" };
        }
        if (!/^7\d{8}$/.test(phoneNorm) && !/^9677\d{8}$/.test(phoneNorm)) {
          return { ok: false, error: "أدخلي رقم جوال يمني صحيح (مثال: 77xxxxxxx)" };
        }
        if (password.length < 4) {
          return { ok: false, error: "كلمة المرور قصيرة جدًا (٤ أحرف على الأقل)" };
        }
        if (emailNorm && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
          return { ok: false, error: "البريد غير صالح" };
        }

        const { users } = get();
        if (users.some((u) => normalizePhone(u.phone) === phoneNorm)) {
          return { ok: false, error: "هذا الرقم مسجّل مسبقًا — جرّبي تسجيل الدخول" };
        }
        if (emailNorm && users.some((u) => u.email && normalizeEmail(u.email) === emailNorm)) {
          return { ok: false, error: "هذا البريد مسجّل مسبقًا — جرّبي تسجيل الدخول" };
        }

        const user: MockCustomerUser = {
          id: newUserId(),
          name: trimmedName,
          phone: phoneNorm,
          email: emailNorm,
          password,
          provider: "local",
          createdAt: new Date().toISOString(),
        };

        const contact = phoneNorm;
        if (autoLogin) {
          const session = sessionFromUser(user);
          set({ users: [...users, user], session });
          syncProfile(session);
        } else {
          set({ users: [...users, user] });
        }
        return { ok: true, userId: user.id, contact };
      },

      login: (identifier, password) => {
        const id = identifier.trim();
        const pass = password;
        if (!id || !pass) {
          return { ok: false, error: "أدخلي البريد أو الجوال وكلمة المرور" };
        }

        let { users } = get();
        if (!users.some((u) => u.id === DEMO_USER.id)) {
          users = [DEMO_USER, ...users];
          set({ users });
        }

        const user = users.find((u) => {
          if (u.provider === "google" && !u.password) return false;
          return matchIdentifier(u, id);
        });

        if (!user || user.password !== pass) {
          return { ok: false, error: "بيانات الدخول غير صحيحة" };
        }

        const session = sessionFromUser(user);
        set({ session });
        syncProfile(session);
        return { ok: true };
      },

      loginWithGoogle: () => {
        let { users } = get();
        const googleEmail = "google.user@gmail.com";
        let user = users.find(
          (u) => u.provider === "google" || normalizeEmail(u.email) === googleEmail
        );

        if (!user) {
          user = {
            id: newUserId(),
            name: "مستخدمة Google",
            phone: "770000001",
            email: googleEmail,
            password: "",
            provider: "google",
            createdAt: new Date().toISOString(),
          };
          users = [...users, user];
        }

        const session = sessionFromUser(user);
        set({ users, session });
        syncProfile(session);
        return { ok: true };
      },

      activateSession: (userId) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) {
          return { ok: false, error: "الحساب غير موجود" };
        }
        const session = sessionFromUser(user);
        set({ session });
        syncProfile(session);
        return { ok: true };
      },

      changePassword: (currentPassword, newPassword) => {
        const session = get().session;
        if (!session) {
          return { ok: false, error: "يلزم تسجيل الدخول" };
        }
        if (newPassword.length < 4) {
          return { ok: false, error: "كلمة المرور الجديدة قصيرة جدًا (٤ أحرف على الأقل)" };
        }
        const users = [...get().users];
        const idx = users.findIndex((u) => u.id === session.userId);
        if (idx < 0) {
          return { ok: false, error: "الحساب غير موجود" };
        }
        const user = users[idx];
        if (user.provider === "google" && !user.password) {
          return {
            ok: false,
            error: "حساب Google التجريبي لا يستخدم كلمة مرور محلية",
          };
        }
        if (user.password !== currentPassword) {
          return { ok: false, error: "كلمة المرور الحالية غير صحيحة" };
        }
        users[idx] = { ...user, password: newPassword };
        set({ users });
        return { ok: true };
      },

      resetPassword: (identifier, newPassword) => {
        if (newPassword.length < 4) {
          return { ok: false, error: "كلمة المرور قصيرة جدًا (٤ أحرف على الأقل)" };
        }
        let { users } = get();
        if (!users.some((u) => u.id === DEMO_USER.id)) {
          users = [DEMO_USER, ...users];
        }
        const idx = users.findIndex((u) => matchIdentifier(u, identifier));
        if (idx < 0) {
          return {
            ok: false,
            error: "لم نجد حسابًا بهذا الرقم أو البريد — تأكدي من البيانات",
          };
        }
        const user = users[idx];
        if (user.provider === "google" && !user.password) {
          return {
            ok: false,
            error: "حساب Google لا يُعاد ضبطه بكلمة مرور محلية في هذا التجريبي",
          };
        }
        const next = [...users];
        next[idx] = { ...user, password: newPassword };
        set({ users: next });
        return { ok: true };
      },

      findUserByIdentifier: (identifier) => {
        let { users } = get();
        if (!users.some((u) => u.id === DEMO_USER.id)) {
          users = [DEMO_USER, ...users];
          set({ users });
        }
        return users.find((u) => matchIdentifier(u, identifier));
      },

      logout: () => set({ session: null }),

      isLoggedIn: () => !!get().session,
    }),
    {
      name: "naqshat-customer-auth",
      partialize: (s) => ({ session: s.session, users: s.users }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export function ensureCustomerAuthHydrated() {
  if (typeof window === "undefined") return;
  const s = useCustomerAuthStore.getState();
  if (!s.hydrated) {
    queueMicrotask(() => {
      if (!useCustomerAuthStore.getState().hydrated) {
        useCustomerAuthStore.getState().setHydrated(true);
      }
    });
  }
}

/** Mock OTP: accept demo code or any 6 digits */
export function isValidMockOtp(code: string): boolean {
  const trimmed = code.replace(/\s/g, "");
  if (trimmed === "123456") return true;
  return /^\d{6}$/.test(trimmed);
}

export const MOCK_OTP_HINT = "123456";
