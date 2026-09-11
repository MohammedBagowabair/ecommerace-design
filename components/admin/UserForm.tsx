"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminUser, AdminUserStatus } from "@/lib/admin/types";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export function UserForm({
  mode,
  user,
}: {
  mode: "create" | "edit";
  user?: AdminUser;
}) {
  const router = useRouter();
  const roles = useAdminDataStore((s) => s.roles);
  const createUser = useAdminDataStore((s) => s.createUser);
  const updateUser = useAdminDataStore((s) => s.updateUser);
  const canManage = useAdminAuthStore((s) => (s.session?.permissions ?? []).includes("users.manage"));
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [roleId, setRoleId] = useState(user?.roleId ?? roles[1]?.id ?? roles[0]?.id ?? "");
  const [status, setStatus] = useState<AdminUserStatus>(user?.status ?? "active");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!canManage) {
      setError("ليس لديك صلاحية إدارة المستخدمين");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError("الاسم والبريد مطلوبان");
      return;
    }

    const users = useAdminDataStore.getState().users;
    const emailTaken = users.some(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.id !== user?.id
    );
    if (emailTaken) {
      setError("البريد مستخدم مسبقًا");
      return;
    }

    if (mode === "create") {
      const id = createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        roleId,
        status,
      });
      showToast("تم إنشاء المستخدم", "success");
      router.push(`/admin/users/${id}`);
    } else if (user) {
      updateUser(user.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        roleId,
        status,
      });
      showToast("تم حفظ التغييرات", "success");
      router.push("/admin/users");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-henna-300 focus:bg-white focus:ring-2 focus:ring-henna-100";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4 rounded-2xl border border-cream-300 bg-white p-5 shadow-card sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink-muted">الاسم</span>
          <input
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canManage}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-muted">البريد</span>
          <input
            type="email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!canManage}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-muted">الجوال</span>
          <input
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!canManage}
            dir="ltr"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-muted">الدور</span>
          <select
            className={fieldClass}
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            disabled={!canManage}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-muted">الحالة</span>
          <select
            className={fieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminUserStatus)}
            disabled={!canManage}
          >
            <option value="active">نشط</option>
            <option value="disabled">معطّل</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href="/admin/users" className="btn-outline w-full sm:w-auto">
          إلغاء
        </Link>
        <button
          type="submit"
          className={cn("btn-primary w-full sm:w-auto", !canManage && "opacity-50")}
          disabled={!canManage}
        >
          {mode === "create" ? "إنشاء" : "حفظ"}
        </button>
      </div>
    </form>
  );
}
