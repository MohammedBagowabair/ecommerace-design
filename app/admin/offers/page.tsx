"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore, newOfferId } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { mergeProducts } from "@/lib/admin/merged-catalog";
import { cn } from "@/lib/utils";
import type { Offer } from "@/lib/types";
import { getOfferHref } from "@/lib/data/offers";
import { MediaUploader } from "@/components/admin/media/MediaUploader";
import { logAdminAudit } from "@/lib/admin/audit";

const emptyForm = (): Offer => ({
  id: "",
  title: "",
  description: "",
  productIds: [],
  discountPercent: 10,
  endsAt: "",
  badge: "",
  isActive: true,
});

export default function AdminOffersPage() {
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("offers.manage")
  );
  const offers = useAdminOpsStore((s) => s.offers);
  const productOverrides = useAdminOpsStore((s) => s.productOverrides);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const upsertOffer = useAdminOpsStore((s) => s.upsertOffer);
  const deleteOffer = useAdminOpsStore((s) => s.deleteOffer);
  const setOfferActive = useAdminOpsStore((s) => s.setOfferActive);
  const showToast = useToastStore((s) => s.show);

  const [form, setForm] = useState<Offer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const products = useMemo(
    () => mergeProducts(productOverrides).filter((p) => p.isActive !== false),
    [productOverrides]
  );

  const openCreate = () => {
    setForm({ ...emptyForm(), id: newOfferId() });
  };

  const openEdit = (o: Offer) => {
    setForm({
      ...o,
      productIds: [...o.productIds],
      endsAt: o.endsAt ? o.endsAt.slice(0, 16) : "",
    });
  };

  const save = () => {
    if (!form || !canManage) return;
    if (!form.title.trim()) {
      showToast("أدخلي عنوان العرض", "error");
      return;
    }
    const payload: Offer = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      badge: form.badge?.trim() || undefined,
      endsAt: form.endsAt
        ? new Date(form.endsAt).toISOString()
        : undefined,
      href: getOfferHref(form.id),
      discountPercent: Math.max(1, Math.min(90, Number(form.discountPercent) || 1)),
      isActive: form.isActive !== false,
    };
    upsertOffer(payload);
    logAdminAudit({
      action: form.title && offers.some((o) => o.id === form.id) ? "تعديل عرض" : "إنشاء عرض",
      target: payload.title,
      entityType: "offer",
      entityId: payload.id,
      after: payload.isActive === false ? "معطّل" : "نشط",
    });
    showToast("تم حفظ العرض", "success");
    setForm(null);
  };

  const toggleProduct = (pid: string) => {
    if (!form) return;
    setForm({
      ...form,
      productIds: form.productIds.includes(pid)
        ? form.productIds.filter((x) => x !== pid)
        : [...form.productIds, pid],
    });
  };

  if (!canManage) {
    return (
      <AdminShell title="العروض">
        <PermissionDenied message="ليس لديك صلاحية إدارة العروض." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="العروض">
      <AdminPageHeader
        title="العروض"
        description="حملات الخصم الوهمية — إنشاء وتعديل وتفعيل"
        breadcrumbs={[{ label: "العروض" }]}
        actions={
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            عرض جديد
          </button>
        }
      />
      <p className="mb-4 text-sm text-ink-muted">{offers.length} حملة</p>

      <div className="grid gap-3 md:grid-cols-2">
        {offers.map((o) => (
          <article
            key={o.id}
            className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-ink">{o.title}</h3>
                  <span
                    className={cn(
                      "badge-pill",
                      o.isActive !== false
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    )}
                  >
                    {o.isActive !== false ? "نشط" : "معطّل"}
                  </span>
                  {o.badge && (
                    <span className="badge-pill bg-gold-50 text-gold-600">{o.badge}</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-muted line-clamp-2">{o.description}</p>
                <p className="mt-2 text-xs text-ink-muted">
                  خصم {o.discountPercent}% · {o.productIds.length} منتج
                  {o.endsAt
                    ? ` · ينتهي ${new Date(o.endsAt).toLocaleDateString("ar-YE", { timeZone: "Asia/Riyadh" })}`
                    : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold hover:bg-cream-50"
                onClick={() => openEdit(o)}
              >
                <Pencil className="h-3 w-3" />
                تعديل
              </button>
              <button
                type="button"
                className="rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold hover:bg-cream-50"
                onClick={() => {
                  setOfferActive(o.id, o.isActive === false);
                  showToast(
                    o.isActive === false ? "تم تفعيل العرض" : "تم تعطيل العرض",
                    "info"
                  );
                }}
              >
                {o.isActive === false ? "تفعيل" : "تعطيل"}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                onClick={() => setDeleteId(o.id)}
              >
                <Trash2 className="h-3 w-3" />
                حذف
              </button>
            </div>
          </article>
        ))}
      </div>

      {!offers.length && (
        <p className="rounded-2xl border border-dashed border-cream-300 bg-white py-12 text-center text-sm text-ink-muted">
          لا توجد عروض بعد
        </p>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-3 sm:items-center">
          <div className="absolute inset-0" onClick={() => setForm(null)} aria-hidden />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-ink">
                {offers.some((o) => o.id === form.id) ? "تعديل عرض" : "عرض جديد"}
              </h3>
              <button
                type="button"
                className="rounded-lg p-1.5 hover:bg-cream-100"
                onClick={() => setForm(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">العنوان</span>
                <input
                  className="input-pill"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">الوصف</span>
                <textarea
                  className="w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">نسبة الخصم %</span>
                  <input
                    type="number"
                    className="input-pill"
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm({ ...form, discountPercent: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">ينتهي</span>
                  <input
                    type="datetime-local"
                    className="input-pill"
                    value={form.endsAt ?? ""}
                    onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold">شارة تسويقية</span>
                <input
                  className="input-pill"
                  value={form.badge ?? ""}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                />
              </label>
              <MediaUploader
                label="صورة العرض"
                values={form.image ? [form.image] : []}
                onChange={(vals) => setForm({ ...form, image: vals[0] })}
                max={1}
                allowVideo={false}
                accept="image/*"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive !== false}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                نشط
              </label>
              <div>
                <p className="mb-2 text-sm font-semibold">المنتجات المشمولة</p>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-cream-200 p-2">
                  {products.slice(0, 40).map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-cream-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                      />
                      <span className="truncate">{p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn-primary flex-1" onClick={save}>
                  حفظ
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1"
                  onClick={() => setForm(null)}
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
        title="حذف العرض؟"
        description="سيتم حذف الحملة من تخزين الإدارة المحلي."
        confirmLabel="حذف"
        tone="danger"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteOffer(deleteId);
            showToast("تم حذف العرض", "info");
          }
          setDeleteId(null);
        }}
      />
    </AdminShell>
  );
}
