"use client";

import { useEffect, useState } from "react";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCustomerStore } from "@/lib/store/customer";
import { useToastStore } from "@/lib/store/toast";
import {
  addressLabelText,
  yemenGovernorates,
} from "@/lib/data/checkout";
import type { Address, AddressLabel } from "@/lib/types";
import { AccountShell } from "@/components/account/AccountNav";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageSkeleton } from "@/components/ui/Skeleton";

type FormState = Omit<Address, "id">;

const emptyForm = (): FormState => ({
  label: "home",
  governorate: "صنعاء",
  city: "",
  area: "",
  street: "",
  details: "",
  phone: "",
  geo: "",
});

export default function AddressesPage() {
  const addresses = useCustomerStore((s) => s.addresses);
  const addAddress = useCustomerStore((s) => s.addAddress);
  const updateAddress = useCustomerStore((s) => s.updateAddress);
  const removeAddress = useCustomerStore((s) => s.removeAddress);
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setErrors({});
    setCreating(true);
  }

  function openEdit(addr: Address) {
    setCreating(false);
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      governorate: addr.governorate,
      city: addr.city,
      area: addr.area,
      street: addr.street,
      details: addr.details ?? "",
      phone: addr.phone,
      geo: addr.geo ?? "",
    });
    setErrors({});
  }

  function closeForm() {
    setCreating(false);
    setEditingId(null);
    setErrors({});
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.governorate) e.governorate = "اختاري المحافظة";
    if (!form.city.trim()) e.city = "أدخلي المدينة";
    if (!form.area.trim()) e.area = "أدخلي الحي";
    if (!form.street.trim()) e.street = "أدخلي الشارع";
    const phone = form.phone.replace(/\s+/g, "");
    if (!/^7\d{8}$/.test(phone) && !/^9677\d{8}$/.test(phone)) {
      e.phone = "رقم تواصل غير صالح";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const payload: FormState = {
      ...form,
      city: form.city.trim(),
      area: form.area.trim(),
      street: form.street.trim(),
      details: form.details?.trim() || undefined,
      phone: form.phone.replace(/\s+/g, ""),
      geo: form.geo?.trim() || undefined,
    };
    if (editingId) {
      updateAddress(editingId, payload);
      showToast("تم تحديث العنوان", "success");
    } else {
      addAddress(payload);
      showToast("تمت إضافة العنوان", "success");
    }
    closeForm();
  }

  const showForm = creating || Boolean(editingId);

  return (
    <AccountShell
      title="عناويني"
      subtitle="أضيفي وعدّلي عناوين التوصيل المحفوظة"
    >
      <div className="mb-4 flex justify-end">
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          عنوان جديد
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="mb-6 rounded-3xl bg-white p-5 shadow-card sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-ink">
              {editingId ? "تعديل العنوان" : "عنوان جديد"}
            </h2>
            <button
              type="button"
              aria-label="إغلاق"
              className="rounded-full p-2 text-ink-muted hover:bg-cream-100"
              onClick={closeForm}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4 flex gap-2">
            {(["home", "work"] as AddressLabel[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setForm((f) => ({ ...f, label: l }))}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  form.label === l
                    ? "bg-henna text-white"
                    : "bg-cream-100 text-ink-muted hover:bg-cream-200"
                )}
              >
                {addressLabelText[l]}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="المحافظة" error={errors.governorate}>
              <select
                className="input-pill rounded-2xl"
                value={form.governorate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, governorate: e.target.value }))
                }
              >
                <option value="">اختاري...</option>
                {yemenGovernorates.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="المدينة" error={errors.city}>
              <input
                className="input-pill rounded-2xl"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              />
            </Field>
            <Field label="الحي / المنطقة" error={errors.area}>
              <input
                className="input-pill rounded-2xl"
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              />
            </Field>
            <Field label="الشارع" error={errors.street}>
              <input
                className="input-pill rounded-2xl"
                value={form.street}
                onChange={(e) =>
                  setForm((f) => ({ ...f, street: e.target.value }))
                }
              />
            </Field>
            <Field label="تفاصيل إضافية" className="sm:col-span-2">
              <input
                className="input-pill rounded-2xl"
                value={form.details ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, details: e.target.value }))
                }
                placeholder="رقم المبنى، علامة مميزة..."
              />
            </Field>
            <Field label="هاتف التواصل" error={errors.phone}>
              <input
                className="input-pill rounded-2xl"
                dir="ltr"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </Field>
            <Field label="موقع / إحداثيات (اختياري)">
              <input
                className="input-pill rounded-2xl"
                dir="ltr"
                value={form.geo ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, geo: e.target.value }))}
                placeholder="15.3, 44.2"
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="submit" className="btn-primary">
              حفظ العنوان
            </button>
            <button type="button" className="btn-outline" onClick={closeForm}>
              إلغاء
            </button>
          </div>
        </form>
      )}

      {!addresses.length ? (
        <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-card">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-henna">
            <MapPin className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <p className="font-bold text-ink">لا عناوين محفوظة بعد</p>
          <p className="mt-1 text-sm text-ink-muted">
            أضيفي عنوان منزلك أو عملك لتسهيل إتمام الطلب لاحقًا.
          </p>
          <button type="button" className="btn-primary mt-5" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            إضافة عنوان
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="rounded-3xl bg-white p-4 shadow-card sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="badge-pill bg-henna-50 text-henna">
                    {addressLabelText[a.label]}
                  </span>
                  <p className="mt-2 font-bold text-ink">
                    {a.area} — {a.street}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {a.governorate}، {a.city}
                    {a.details ? ` · ${a.details}` : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted" dir="ltr">
                    {a.phone}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label="تعديل"
                    className="rounded-full p-2 text-ink-muted hover:bg-cream-100 hover:text-henna"
                    onClick={() => openEdit(a)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="حذف"
                    className="rounded-full p-2 text-ink-muted hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      if (addresses.length <= 1) {
                        showToast("يجب الإبقاء على عنوان واحد على الأقل", "error");
                        return;
                      }
                      setDeleteId(a.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="حذف العنوان؟"
        description="لن يظهر هذا العنوان في قائمة عناوينكِ عند إتمام الطلب."
        confirmLabel="حذف العنوان"
        cancelLabel="إبقاء"
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeAddress(deleteId);
            showToast("تم حذف العنوان", "info");
          }
          setDeleteId(null);
        }}
      />
    </AccountShell>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
