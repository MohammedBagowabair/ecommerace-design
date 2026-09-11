import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Tag,
  Users,
  Shield,
  Settings,
  UsersRound,
  ScrollText,
} from "lucide-react";
import type { Permission } from "@/lib/admin/types";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Any of these permissions shows the item */
  permissions: Permission[];
  exact?: boolean;
  stub?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    permissions: ["dashboard.view"],
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "الطلبات",
    icon: ShoppingBag,
    permissions: ["orders.view", "orders.manage"],
  },
  {
    href: "/admin/products",
    label: "المنتجات",
    icon: Package,
    permissions: ["products.view", "products.manage"],
  },
  {
    href: "/admin/categories",
    label: "الأقسام",
    icon: FolderTree,
    permissions: ["categories.manage"],
  },
  {
    href: "/admin/offers",
    label: "العروض",
    icon: Tag,
    permissions: ["offers.manage"],
  },
  {
    href: "/admin/customers",
    label: "العملاء",
    icon: UsersRound,
    permissions: ["customers.view"],
  },
  {
    href: "/admin/users",
    label: "المستخدمون",
    icon: Users,
    permissions: ["users.view", "users.manage"],
  },
  {
    href: "/admin/roles",
    label: "الأدوار",
    icon: Shield,
    permissions: ["roles.manage"],
  },
  {
    href: "/admin/activity",
    label: "سجل النشاط",
    icon: ScrollText,
    permissions: ["dashboard.view"],
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: Settings,
    permissions: ["settings.manage"],
  },
];
