"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { mergeCategories, mergeProducts } from "@/lib/admin/merged-catalog";
import { cn } from "@/lib/utils";
import type { CategoryOverride } from "@/lib/admin/ops-types";

export default function AdminCategoriesPage() {
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("categories.manage")
  );
  // viewers don't have categories.manage — deny
  const canView = canManage;

  const overrides = useAdminOpsStore((s) => s.categoryOverrides);
  const productOverrides = useAdminOpsStore((s) => s.productOverrides);
  const setCategoryOverride = useAdminOpsStore((s) => s.setCategoryOverride);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const showToast = useToastStore((s) => s.show);

  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const products = useMemo(
    () => mergeProducts(productOverrides),
    [productOverrides]
  );
  const categories = useMemo(
    () => mergeCategories(overrides, products),
    [overrides, products]
  );

  const editing = categories.find((c) => c.id === editId);

  const openEdit = (id: string) => {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    setEditId(id);
    setName(c.name);
    setDescription(c.description);
    setSlug(c.slug);
    setImage(c.image);
    setIsActive(c.isActive !== false);
  };

  const save = () => {
    if (!editId || !canManage) return;
    if (!name.trim()) {
      showToast("اسم القسم مطلوب", "error");
      return;
    }
    if (!slug.trim()) {
      showToast("المعرّف (slug) مطلوب", "error");
      return;
    }
    const patch: CategoryOverride = {
      name: name.trim(),
      description: description.trim(),
      slug: slug.trim(),
      image: image.trim() || undefined,
      isActive,
    };
    setCategoryOverride(editId, patch);
    showToast("تم حفظ القسم", "success");
    setEditId(null);
  };

  if (!canView) {
    return (
      <AdminShell title="الأقسام">
        <PermissionDenied message="ليس لديك صلاحية إدارة الأقسام." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="الأقسام">
      <AdminPageHeader
        title="الأقسام"
        description="تعديل الأسماء والأوصاف وصور الأقسام (تجاوزات محلية)"
        breadcrumbs={[{ label: "الأقسام" }]}
      />
      <p className="mb-4 text-sm text-ink-muted">{categories.length} قسم</p>

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[720px]">
            <thead>
              <tr className="text-start">
                <th className="px-4 py-2.5 font-semibold">القسم</th>
                <th className="px-4 py-2.5 font-semibold">المعرّف</th>
                <th className="px-4 py-2.5 font-semibold">المنتجات</th>
                <th className="px-4 py-2.5 font-semibold">الحالة</th>
                <th className="px-4 py-2.5 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-cream-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                        <Image
                          src={c.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">{c.name}</p>
                        <p className="line-clamp-1 text-xs text-ink-muted">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted" dir="ltr">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{c.productCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "badge-pill",
                        c.isActive !== false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {c.isActive !== false ? "نشط" : "معطّل"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink hover:bg-cream-50"
                      onClick={() => openEdit(c.id)}
                    >
                      <Pencil className="h-3 w-3" />
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => setEditId(null)}
            aria-hidden
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-ink">تعديل القسم</h3>
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-cream-100"
                onClick={() => setEditId(null)}
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">الاسم</span>
                <input
                  className="input-pill"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">الوصف</span>
                <textarea
                  className="w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Slug</span>
                <input
                  className="input-pill"
                  dir="ltr"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">رابط الصورة</span>
                <input
                  className="input-pill"
                  dir="ltr"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                نشط
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn-primary flex-1" onClick={save}>
                  حفظ
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => setEditId(null)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
