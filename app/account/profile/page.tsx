"use client";

import { useEffect, useState } from "react";
import { useCustomerStore } from "@/lib/store/customer";
import { useToastStore } from "@/lib/store/toast";
import { AccountShell } from "@/components/account/AccountNav";
import type { CustomerProfile } from "@/lib/types";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function ProfilePage() {
  const profile = useCustomerStore((s) => s.profile);
  const updateProfile = useCustomerStore((s) => s.updateProfile);
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<CustomerProfile>(profile);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerProfile, string>>>({});

  useEffect(() => {
    setMounted(true);
    setForm(profile);
  }, [profile]);

  if (!mounted) {
    return <PageSkeleton />;
  }

  function validate(): boolean {
    const e: Partial<Record<keyof CustomerProfile, string>> = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      e.name = "أدخلي الاسم (حرفان على الأقل)";
    }
    const phone = form.phone.replace(/\s+/g, "");
    if (!/^7\d{8}$/.test(phone) && !/^9677\d{8}$/.test(phone)) {
      e.phone = "أدخلي رقم جوال يمني صحيح";
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "البريد غير صالح";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    updateProfile({
      name: form.name.trim(),
      phone: form.phone.replace(/\s+/g, ""),
      email: form.email.trim(),
    });
    showToast("تم حفظ معلوماتك", "success");
  }

  return (
    <AccountShell title="معلوماتي" subtitle="تعديل بيانات الحساب (وهمي — بدون تسجيل دخول)">
      <form
        onSubmit={onSave}
        className="rounded-3xl bg-white p-5 shadow-card sm:p-6"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              الاسم الكامل
            </label>
            <input
              className="input-pill rounded-2xl"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="مثال: سارة أحمد"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              رقم الجوال
            </label>
            <input
              className="input-pill rounded-2xl"
              dir="ltr"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="7XXXXXXXX"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">
              البريد الإلكتروني{" "}
              <span className="font-normal text-ink-light">(اختياري)</span>
            </label>
            <input
              type="email"
              className="input-pill rounded-2xl"
              dir="ltr"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
        <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
          حفظ التغييرات
        </button>
        <p className="mt-3 text-xs text-ink-light">
          تُحفظ البيانات محليًا في متصفحك فقط — لا يوجد خادم خلف هذه الصفحة.
        </p>
      </form>
    </AccountShell>
  );
}
