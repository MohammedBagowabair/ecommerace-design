"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, UserX, UserCheck, Trash2, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";
import type { AdminUserStatus } from "@/lib/admin/types";

export default function AdminUsersPage() {
  const users = useAdminDataStore((s) => s.users);
  const roles = useAdminDataStore((s) => s.roles);
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const setUserStatus = useAdminDataStore((s) => s.setUserStatus);
  const deleteUser = useAdminDataStore((s) => s.deleteUser);
  const canManage = useAdminAuthStore((s) => (s.session?.permissions ?? []).includes("users.manage"));
  const canView = useAdminAuthStore((s) => {
    const p = s.session?.permissions ?? [];
    return p.includes("users.view") || p.includes("users.manage");
  });
  const session = useAdminAuthStore((s) => s.session);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const showToast = useToastStore((s) => s.show);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminUserStatus>("all");
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.roleId !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (!query) return true;
      const hay = `${u.name} ${u.email} ${u.phone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [users, q, roleFilter, statusFilter]);

  const confirmUser = users.find((u) => u.id === confirmUserId);
  const deleteTarget = users.find((u) => u.id === deleteUserId);

  if (!canView) {
    return (
      <AdminShell title="المستخدمون">
        <div className="rounded-2xl border border-cream-200 bg-white p-8 text-center text-sm text-ink-muted shadow-card">
          ليس لديك صلاحية عرض المستخدمين.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="المستخدمون">
      <AdminPageHeader
        title="المستخدمون"
        description="حسابات لوحة الإدارة التجريبية مع أدوار وصلاحيات"
        breadcrumbs={[{ label: "المستخدمون" }]}
        actions={
          canManage ? (
            <Link href="/admin/users/new" className="btn-primary w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              مستخدم جديد
            </Link>
          ) : undefined
        }
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            className="input-pill ps-10"
            placeholder="بحث بالاسم أو البريد…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">كل الأدوار</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="disabled">معطّل</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-ink-muted">{filtered.length} مستخدم</p>

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        {!filtered.length ? (
          <div className="flex flex-col items-center px-4 py-14 text-center">
            <Users className="h-10 w-10 text-ink-light" />
            <p className="mt-3 text-sm font-semibold text-ink">لا مستخدمين مطابقين</p>
            <p className="mt-1 text-xs text-ink-muted">عدّلي البحث أو الفلاتر</p>
            {canManage && (
              <Link href="/admin/users/new" className="btn-primary mt-4">
                إضافة مستخدم
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[760px]">
              <thead>
                <tr className="text-start">
                  <th className="px-4 py-2.5 font-semibold">الاسم</th>
                  <th className="px-4 py-2.5 font-semibold">البريد</th>
                  <th className="px-4 py-2.5 font-semibold">الدور</th>
                  <th className="px-4 py-2.5 font-semibold">الحالة</th>
                  <th className="px-4 py-2.5 font-semibold">آخر دخول</th>
                  <th className="px-4 py-2.5 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const role = roles.find((r) => r.id === u.roleId);
                  return (
                    <tr key={u.id} className="border-b border-cream-100 last:border-0">
                      <td className="px-4 py-3 font-semibold text-ink">{u.name}</td>
                      <td className="px-4 py-3 text-ink-muted" dir="ltr">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge-pill bg-henna-50 text-henna">{role?.name ?? "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "badge-pill",
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          )}
                        >
                          {u.status === "active" ? "نشط" : "معطّل"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleString("ar-YE", {
                              timeZone: "Asia/Riyadh",
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink hover:bg-cream-50"
                          >
                            <Pencil className="h-3 w-3" />
                            تعديل
                          </Link>
                          {canManage &&
                            (u.status === "active" ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                onClick={() => setConfirmUserId(u.id)}
                              >
                                <UserX className="h-3 w-3" />
                                تعطيل
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                                onClick={() => {
                                  const res = setUserStatus(u.id, "active");
                                  if (!res.ok) {
                                    showToast(res.error, "error");
                                    return;
                                  }
                                  showToast("تم تفعيل المستخدم", "success");
                                }}
                              >
                                <UserCheck className="h-3 w-3" />
                                تفعيل
                              </button>
                            ))}
                          {canManage && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink-muted hover:bg-cream-50"
                              onClick={() => setDeleteUserId(u.id)}
                              title="حذف"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmUser}
        title="تعطيل المستخدم؟"
        description={
          confirmUser
            ? `سيتم منع «${confirmUser.name}» من الدخول إلى لوحة الإدارة.`
            : undefined
        }
        confirmLabel="تعطيل"
        tone="danger"
        onCancel={() => setConfirmUserId(null)}
        onConfirm={() => {
          if (confirmUserId) {
            const res = setUserStatus(confirmUserId, "disabled");
            if (!res.ok) {
              showToast(res.error, "error");
            } else {
              addActivity({
                actorName: session?.name ?? "مشرف",
                action: "تعطيل مستخدم",
                target: confirmUser?.name ?? confirmUserId,
              });
              showToast("تم تعطيل المستخدم", "info");
            }
          }
          setConfirmUserId(null);
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف المستخدم؟"
        description={
          deleteTarget
            ? `حذف «${deleteTarget.name}» نهائيًا من تخزين الإدارة المحلي. لا يمكن حذف آخر مدير أعلى نشط.`
            : undefined
        }
        confirmLabel="حذف"
        tone="danger"
        onCancel={() => setDeleteUserId(null)}
        onConfirm={() => {
          if (deleteUserId) {
            const res = deleteUser(deleteUserId);
            if (!res.ok) showToast(res.error, "error");
            else {
              addActivity({
                actorName: session?.name ?? "مشرف",
                action: "حذف مستخدم",
                target: deleteTarget?.name ?? deleteUserId,
              });
              showToast("تم حذف المستخدم", "info");
            }
          }
          setDeleteUserId(null);
        }}
      />
    </AdminShell>
  );
}
