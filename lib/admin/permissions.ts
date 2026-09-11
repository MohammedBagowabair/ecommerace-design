import type { Permission } from "./types";

export const ALL_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "orders.view",
  "orders.manage",
  "products.view",
  "products.manage",
  "categories.manage",
  "offers.manage",
  "customers.view",
  "users.view",
  "users.manage",
  "roles.manage",
  "settings.manage",
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  "dashboard.view": "عرض لوحة التحكم",
  "orders.view": "عرض الطلبات",
  "orders.manage": "إدارة الطلبات",
  "products.view": "عرض المنتجات",
  "products.manage": "إدارة المنتجات",
  "categories.manage": "إدارة الأقسام",
  "offers.manage": "إدارة العروض",
  "customers.view": "عرض العملاء",
  "users.view": "عرض المستخدمين",
  "users.manage": "إدارة المستخدمين",
  "roles.manage": "إدارة الأدوار",
  "settings.manage": "إدارة الإعدادات",
};

export const PERMISSION_GROUPS: { title: string; permissions: Permission[] }[] = [
  {
    title: "لوحة التحكم",
    permissions: ["dashboard.view"],
  },
  {
    title: "الطلبات",
    permissions: ["orders.view", "orders.manage"],
  },
  {
    title: "المنتجات والأقسام",
    permissions: ["products.view", "products.manage", "categories.manage"],
  },
  {
    title: "العروض والعملاء",
    permissions: ["offers.manage", "customers.view"],
  },
  {
    title: "المستخدمون والأدوار",
    permissions: ["users.view", "users.manage", "roles.manage"],
  },
  {
    title: "الإعدادات",
    permissions: ["settings.manage"],
  },
];

export function hasPermission(
  perms: Permission[] | undefined | null,
  required: Permission | Permission[]
): boolean {
  if (!perms?.length) return false;
  const list = Array.isArray(required) ? required : [required];
  return list.every((p) => perms.includes(p));
}

export function hasAnyPermission(
  perms: Permission[] | undefined | null,
  required: Permission[]
): boolean {
  if (!perms?.length) return false;
  return required.some((p) => perms.includes(p));
}
