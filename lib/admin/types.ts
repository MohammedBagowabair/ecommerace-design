export type Permission =
  | "dashboard.view"
  | "orders.view"
  | "orders.manage"
  | "products.view"
  | "products.manage"
  | "categories.manage"
  | "offers.manage"
  | "customers.view"
  | "users.view"
  | "users.manage"
  | "roles.manage"
  | "settings.manage";

export type AdminUserStatus = "active" | "disabled";

export interface AdminRole {
  id: string;
  slug: string;
  name: string;
  description: string;
  permissions: Permission[];
  /** Built-in seed roles cannot be deleted */
  isSystem?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: AdminUserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  /** Demo password hint only — mock auth accepts any password */
  demoPassword?: string;
}

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  roleId: string;
  roleSlug: string;
  permissions: Permission[];
  loggedInAt: string;
}
