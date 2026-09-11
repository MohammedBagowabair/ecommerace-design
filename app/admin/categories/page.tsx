"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { SafeMedia } from "@/components/media/SafeMedia";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { mergeCategories, mergeProducts, slugifyArabic } from "@/lib/admin/merged-catalog";
import { cn } from "@/lib/utils";
import type { CategoryOverride } from "@/lib/admin/ops-types";
import type { MergedCategory } from "@/lib/admin/ops-types";
import { logAdminAudit } from "@/lib/admin/audit";

type EditState = {
  id: string | null;
  name: string;
  description: string;
  slug: string;
  image: string;
  parentId: string | null;
  isActive: boolean;
  isNew: boolean;
};

const blankEdit = (parentId: string | null = null): EditState => ({
  id: null,
  name: "",
  description: "",
  slug: "",
  image: "",
  parentId,
  isActive: true,
  isNew: true,
});

export default function AdminCategoriesPage() {
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("categories.manage")
  );
  const overrides = useAdminOpsStore((s) => s.categoryOverrides);
  const customCategories = useAdminOpsStore((s) => s.customCategories);
  const productOverrides = useAdminOpsStore((s) => s.productOverrides);
  const customProducts = useAdminOpsStore((s) => s.customProducts);
  const setCategoryOverride = useAdminOpsStore((s) => s.setCategoryOverride);
  const addCustomCategory = useAdminOpsStore((s) => s.addCustomCategory);
  const updateCustomCategory = useAdminOpsStore((s) => s.updateCustomCategory);
  const deleteCustomCategory = useAdminOpsStore((s) => s.deleteCustomCategory);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const showToast = useToastStore((s) => s.show);

  const [edit, setEdit] = useState<EditState | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const products = useMemo(
    () => mergeProducts(productOverrides, customProducts),
    [productOverrides, customProducts]
  );
  const categories = useMemo(
    () => mergeCategories(overrides, products, customCategories),
    [overrides, products, customCategories]
  );

  const parents = categories.filter((c) => !c.parentId);
  const childrenOf = (pid: string) => categories.filter((c) => c.parentId === pid);

  const openEdit = (c: MergedCategory) => {
    setEdit({
      id: c.id,
      name: c.name,
      description: c.description,
      slug: c.slug,
      image: c.image,
      parentId: c.parentId ?? null,
      isActive: c.isActive !== false,
      isNew: false,
    });
  };

  const openCreate = (parentId: string | null = null) => {
    setEdit(blankEdit(parentId));
  };

  const save = () => {
    if (!edit || !canManage) return;
    if (!edit.name.trim()) {
      showToast("اسم القسم مطلوب", "error");
      return;
    }
    const slug = (edit.slug.trim() || slugifyArabic(edit.name)).trim();
    if (!slug) {
      showToast("المعرّف (slug) مطلوب", "error");
      return;
    }
    if (!edit.image.trim()) {
      showToast("أضيفي صورة للقسم", "error");
      return;
    }

    if (edit.isNew || !edit.id) {
      const id = addCustomCategory({
        id: `ccat-${Date.now().toString(36)}`,
        name: edit.name.trim(),
        description: edit.description.trim(),
        slug,
        image: edit.image,
        productCount: 0,
        parentId: edit.parentId,
        isActive: edit.isActive,
      });
      showToast(edit.parentId ? "تم إنشاء القسم الفرعي" : "تم إنشاء القسم", "success");
      logAdminAudit({
        action: edit.parentId ? "إنشاء قسم فرعي" : "إنشاء قسم",
        target: edit.name.trim(),
        entityType: "category",
        entityId: id,
      });
      void id;
    } else {
      const isCustom = customCategories.some((c) => c.id === edit.id);
      const patch: CategoryOverride = {
        name: edit.name.trim(),
        description: edit.description.trim(),
        slug,
        image: edit.image,
        parentId: edit.parentId,
        isActive: edit.isActive,
      };
      if (isCustom) {
        updateCustomCategory(edit.id, {
          name: patch.name!,
          description: patch.description!,
          slug: patch.slug!,
          image: patch.image!,
          parentId: patch.parentId,
          isActive: edit.isActive,
        });
      }
      setCategoryOverride(edit.id, patch);
      showToast("تم حفظ القسم", "success");
      logAdminAudit({
        action: "تعديل قسم",
        target: edit.name.trim(),
        entityType: "category",
        entityId: edit.id,
      });
    }
    setEdit(null);
  };

  if (!canManage) {
    return (
      <AdminShell title="الأقسام">
        <PermissionDenied message="ليس لديك صلاحية إدارة الأقسام." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="الأقسام">
      <AdminPageHeader
        title="الأقسام والأقسام الفرعية"
        description="إدارة الهيكل الشجري — قسم رئيسي ثم أقسام فرعية (محلي وهمي)"
        breadcrumbs={[{ label: "الأقسام" }]}
        actions={
          <button type="button" className="btn-primary" onClick={() => openCreate(null)}>
            <Plus className="h-4 w-4" />
            قسم رئيسي
          </button>
        }
      />

      <div className="space-y-4">
        {parents.map((parent) => {
          const kids = childrenOf(parent.id);
          return (
            <div
              key={parent.id}
              className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card"
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-cream-100 px-4 py-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <SafeMedia src={parent.image} alt="" fill sizes="48px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink">{parent.name}</p>
                  <p className="text-xs text-ink-muted" dir="ltr">
                    {parent.slug} · {parent.productCount} منتج
                  </p>
                </div>
                <span
                  className={cn(
                    "badge-pill",
                    parent.isActive !== false
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  )}
                >
                  {parent.isActive !== false ? "نشط" : "معطّل"}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold"
                  onClick={() => openEdit(parent)}
                >
                  <Pencil className="h-3 w-3" />
                  تعديل
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-lg border border-henna-200 bg-henna-50 px-2 py-1 text-xs font-semibold text-henna"
                  onClick={() => openCreate(parent.id)}
                >
                  <Plus className="h-3 w-3" />
                  فرعي
                </button>
                {customCategories.some((c) => c.id === parent.id) && (
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 p-1.5 text-red-600"
                    onClick={() => setDeleteId(parent.id)}
                    aria-label="حذف"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {kids.length > 0 ? (
                <ul className="divide-y divide-cream-100">
                  {kids.map((sub) => (
                    <li
                      key={sub.id}
                      className="flex flex-wrap items-center gap-3 px-4 py-2.5 ps-8"
                    >
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                        <SafeMedia src={sub.image} alt="" fill sizes="36px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">{sub.name}</p>
                        <p className="text-[10px] text-ink-light" dir="ltr">
                          {sub.slug}
                        </p>
                      </div>
                      <span className="text-xs text-ink-muted">{sub.productCount}</span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-henna hover:underline"
                        onClick={() => openEdit(sub)}
                      >
                        تعديل
                      </button>
                      {customCategories.some((c) => c.id === sub.id) && (
                        <button
                          type="button"
                          className="text-xs font-semibold text-red-600 hover:underline"
                          onClick={() => setDeleteId(sub.id)}
                        >
                          حذف
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-xs text-ink-light">لا أقسام فرعية بعد</p>
              )}
            </div>
          );
        })}
      </div>

      {edit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center">
          <div className="absolute inset-0" onClick={() => setEdit(null)} aria-hidden />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-ink">
                {edit.isNew
                  ? edit.parentId
                    ? "قسم فرعي جديد"
                    : "قسم رئيسي جديد"
                  : "تعديل القسم"}
              </h3>
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-cream-100"
                onClick={() => setEdit(null)}
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
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">الوصف</span>
                <textarea
                  className="w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
                  rows={3}
                  value={edit.description}
                  onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">Slug</span>
                <input
                  className="input-pill"
                  dir="ltr"
                  value={edit.slug}
                  onChange={(e) => setEdit({ ...edit, slug: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">القسم الأب</span>
                <select
                  className="input-pill"
                  value={edit.parentId ?? ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      parentId: e.target.value || null,
                    })
                  }
                >
                  <option value="">— رئيسي (بدون أب) —</option>
                  {parents
                    .filter((p) => p.id !== edit.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
              <MediaUploader
                label="صورة القسم"
                values={edit.image ? [edit.image] : []}
                onChange={(vals) => setEdit({ ...edit, image: vals[0] ?? "" })}
                max={1}
                allowVideo={false}
                accept="image/*"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={edit.isActive}
                  onChange={(e) => setEdit({ ...edit, isActive: e.target.checked })}
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
                  onClick={() => setEdit(null)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="حذف القسم؟"
        description="يُحذف القسم المخصّص فقط إن لم يكن له أقسام فرعية."
        confirmLabel="حذف"
        tone="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            const ok = deleteCustomCategory(deleteId);
            showToast(ok ? "تم الحذف" : "تعذّر الحذف (تحقق من الأقسام الفرعية)", ok ? "info" : "error");
          }
          setDeleteId(null);
        }}
      />
    </AdminShell>
  );
}
