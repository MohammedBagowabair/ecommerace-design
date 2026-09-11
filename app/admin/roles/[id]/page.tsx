"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  PERMISSION_GROUPS,
  PERMISSION_LABELS,
} from "@/lib/admin/permissions";
import type { Permission } from "@/lib/admin/types";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useToastStore } from "@/lib/store/toast";
import { cn } from "@/lib/utils";

export default function EditRolePage() {
  const params = useParams();
  const id = String(params.id || "");
  const router = useRouter();
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const role = useAdminDataStore((s) => s.roles.find((r) => r.id === id));
  const updateRole = useAdminDataStore((s) => s.updateRole);
  const canManage = useAdminAuthStore((s) => (s.session?.permissions ?? []).includes("roles.manage"));
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [perms, setPerms] = useState<Permission[]>([]);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
      setPerms([...role.permissions]);
    }
  }, [role]);

  function toggle(p: Permission) {
    setPerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canManage || !role) return;
    updateRole(role.id, { name: name.trim(), description: description.trim(), permissions: perms });
    showToast("تم حفظ صلاحيات الدور", "success");
    router.push("/admin/roles");
  }

  if (!canManage) {
    return (
      <AdminShell title="تعديل دور">
        <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center text-sm text-ink-muted shadow-card">
          ليس لديك صلاحية إدارة الأدوار.
        </div>
      </AdminShell>
    );
  }

  if (!role) {
    return (
      <AdminShell title="تعديل دور">
        <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center shadow-card">
          <p className="text-sm text-ink-muted">الدور غير موجود</p>
          <Link href="/admin/roles" className="mt-3 inline-block text-sm font-semibold text-henna hover:underline">
            العودة
          </Link>
        </div>
      </AdminShell>
    );
  }

  const fieldClass =
    "w-full rounded-xl border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-henna-300 focus:bg-white focus:ring-2 focus:ring-henna-100";

  return (
    <AdminShell title={`تعديل: ${role.name}`}>
      <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-ink-muted">اسم الدور</span>
              <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-ink-muted">الوصف</span>
              <textarea
                className="textarea-field min-h-[80px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <p className="mt-2 text-[11px] text-ink-light">المعرّف: {role.slug}</p>
        </div>

        <div className="rounded-2xl border border-cream-300 bg-white p-5 shadow-card">
          <h2 className="mb-4 text-sm font-bold text-ink">مصفوفة الصلاحيات</h2>
          <div className="space-y-5">
            {PERMISSION_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
                  {group.title}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.permissions.map((p) => {
                    const checked = perms.includes(p);
                    return (
                      <label
                        key={p}
                        className={cn(
                          "flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 transition",
                          checked
                            ? "border-henna-200 bg-henna-50"
                            : "border-cream-300 bg-cream-50 hover:bg-white"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 rounded border-cream-300 text-henna focus:ring-henna-200"
                          checked={checked}
                          onChange={() => toggle(p)}
                        />
                        <span>
                          <span className="block text-sm font-semibold text-ink">
                            {PERMISSION_LABELS[p]}
                          </span>
                          <span className="text-[10px] text-ink-light" dir="ltr">
                            {p}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Link href="/admin/roles" className="btn-outline w-full sm:w-auto">
            إلغاء
          </Link>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            حفظ
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
