"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, Pencil, Trash2, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useToastStore } from "@/lib/store/toast";
import { ALL_PERMISSIONS, PERMISSION_LABELS } from "@/lib/admin/permissions";

export default function AdminRolesPage() {
  const roles = useAdminDataStore((s) => s.roles);
  const users = useAdminDataStore((s) => s.users);
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const deleteRole = useAdminDataStore((s) => s.deleteRole);
  const countUsersByRole = useAdminDataStore((s) => s.countUsersByRole);
  const canManage = useAdminAuthStore((s) => (s.session?.permissions ?? []).includes("roles.manage"));
  const showToast = useToastStore((s) => s.show);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  if (!canManage) {
    return (
      <AdminShell title="الأدوار">
        <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center text-sm text-ink-muted shadow-card">
          ليس لديك صلاحية إدارة الأدوار.
        </div>
      </AdminShell>
    );
  }

  const deleteTarget = roles.find((r) => r.id === deleteId);

  return (
    <AdminShell title="الأدوار والصلاحيات">
      <AdminPageHeader
        title="الأدوار والصلاحيات"
        description="أدوار النظام التجريبية — عدّلي مصفوفة الصلاحيات (تسميات عربية)"
        breadcrumbs={[{ label: "الأدوار" }]}
      />

      {!roles.length ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-cream-300 bg-white py-14 text-center shadow-card">
          <Shield className="h-10 w-10 text-ink-light" />
          <p className="mt-3 text-sm font-semibold text-ink">لا أدوار بعد</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {roles.map((role) => {
            const usage = countUsersByRole(role.id);
            const samplePerms = role.permissions.slice(0, 3);
            return (
              <div
                key={role.id}
                className="flex flex-col rounded-2xl border border-cream-300 bg-white p-4 shadow-card"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-henna-50 text-henna">
                    <Shield className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.isSystem && (
                      <span className="badge-pill bg-cream-200 text-ink-muted">نظام</span>
                    )}
                    <span className="inline-flex items-center gap-1 badge-pill bg-sky-50 text-sky-700">
                      <Users className="h-3 w-3" />
                      {usage}
                    </span>
                  </div>
                </div>
                <h2 className="text-base font-bold text-ink">{role.name}</h2>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-ink-muted">
                  {role.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-henna">
                  {role.permissions.length} / {ALL_PERMISSIONS.length} صلاحية
                </p>
                <ul className="mt-2 space-y-0.5">
                  {samplePerms.map((p) => (
                    <li key={p} className="truncate text-[10px] text-ink-light">
                      · {PERMISSION_LABELS[p]}
                    </li>
                  ))}
                  {role.permissions.length > 3 && (
                    <li className="text-[10px] text-ink-light">
                      +{role.permissions.length - 3} أخرى
                    </li>
                  )}
                </ul>
                <div className="mt-3 flex gap-1.5">
                  <Link
                    href={`/admin/roles/${role.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-cream-300 px-3 py-2 text-xs font-semibold text-ink transition hover:bg-cream-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    تعديل
                  </Link>
                  {!role.isSystem && (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl border border-red-200 px-2.5 text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(role.id)}
                      aria-label="حذف الدور"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 text-xs text-ink-muted">
        إجمالي المستخدمين المرتبطين: {users.length} · لا يمكن حذف آخر مدير أعلى أو أدوار النظام
      </p>

      <ConfirmDialog
        open={!!deleteTarget}
        title="حذف الدور؟"
        description={
          deleteTarget
            ? `حذف «${deleteTarget.name}» — يجب ألا يكون مرتبطًا بمستخدمين.`
            : undefined
        }
        confirmLabel="حذف"
        tone="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            const res = deleteRole(deleteId);
            if (!res.ok) showToast(res.error, "error");
            else showToast("تم حذف الدور", "info");
          }
          setDeleteId(null);
        }}
      />
    </AdminShell>
  );
}
