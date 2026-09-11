"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import type { BankAccount } from "@/lib/types";

export default function AdminSettingsPage() {
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("settings.manage")
  );
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const updateSettings = useAdminOpsStore((s) => s.updateSettings);
  const resetSettings = useAdminOpsStore((s) => s.resetSettings);
  const showToast = useToastStore((s) => s.show);

  const [storeName, setStoreName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappDisplay, setWhatsappDisplay] = useState("");
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [ready, setReady] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  useEffect(() => {
    setStoreName(settings.storeName);
    setWhatsapp(settings.whatsapp);
    setWhatsappDisplay(settings.whatsappDisplay);
    setBanks(settings.bankAccounts.map((b) => ({ ...b })));
    setReady(true);
  }, [settings]);

  if (!canManage) {
    return (
      <AdminShell title="الإعدادات">
        <PermissionDenied message="ليس لديك صلاحية إدارة الإعدادات." />
      </AdminShell>
    );
  }

  if (!ready) {
    return (
      <AdminShell title="الإعدادات">
        <div className="h-40 animate-pulse rounded-2xl bg-cream-200" />
      </AdminShell>
    );
  }

  const updateBank = (index: number, patch: Partial<BankAccount>) => {
    setBanks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...patch } : b))
    );
  };

  const addBank = () => {
    setBanks((prev) => [
      ...prev,
      {
        id: `bank-${Date.now().toString(36)}`,
        bankName: "",
        accountName: "",
        accountNumber: "",
        currency: "YER",
      },
    ]);
  };

  const removeBank = (index: number) => {
    setBanks((prev) => prev.filter((_, i) => i !== index));
  };

  const save = () => {
    if (!storeName.trim()) {
      showToast("اسم المتجر مطلوب", "error");
      return;
    }
    if (!whatsapp.trim()) {
      showToast("رقم واتساب مطلوب", "error");
      return;
    }
    if (!banks.length) {
      showToast("أضيفي حسابًا بنكيًا واحدًا على الأقل", "error");
      return;
    }
    for (const b of banks) {
      if (!b.bankName.trim() || !b.accountNumber.trim()) {
        showToast("أكمل بيانات الحسابات البنكية", "error");
        return;
      }
    }
    updateSettings({
      storeName: storeName.trim() || settings.storeName,
      whatsapp: whatsapp.trim(),
      whatsappDisplay: whatsappDisplay.trim(),
      bankAccounts: banks,
    });
    showToast("تم حفظ إعدادات المتجر (محليًا)", "success");
  };

  return (
    <AdminShell title="الإعدادات">
      <AdminPageHeader
        title="الإعدادات"
        description="اسم المتجر، واتساب، والحسابات البنكية (وهمي محلي)"
        breadcrumbs={[{ label: "الإعدادات" }]}
      />
      <div className="mx-auto max-w-2xl space-y-5">
        <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-3 text-sm font-bold text-ink">معلومات المتجر</h2>
          <p className="mb-4 text-xs text-ink-muted">
            إعدادات وهمية في localStorage (`naqshat-admin-ops`) — لا تغيّر واجهة
            المتجر تلقائيًا في هذه المرحلة.
          </p>
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">اسم المتجر</span>
              <input
                className="input-pill"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">واتساب (دولي بدون +)</span>
              <input
                className="input-pill"
                dir="ltr"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">عرض رقم الواتساب</span>
              <input
                className="input-pill"
                dir="ltr"
                value={whatsappDisplay}
                onChange={(e) => setWhatsappDisplay(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink">الحسابات البنكية</h2>
            <button type="button" className="text-xs font-semibold text-henna hover:underline" onClick={addBank}>
              + إضافة حساب
            </button>
          </div>
          <div className="space-y-4">
            {banks.map((b, i) => (
              <div
                key={b.id}
                className="space-y-2 rounded-xl border border-cream-200 bg-cream-50/50 p-3"
              >
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">البنك</span>
                  <input
                    className="input-pill bg-white"
                    value={b.bankName}
                    onChange={(e) => updateBank(i, { bankName: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">اسم الحساب</span>
                  <input
                    className="input-pill bg-white"
                    value={b.accountName}
                    onChange={(e) => updateBank(i, { accountName: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">رقم الحساب</span>
                  <input
                    className="input-pill bg-white"
                    dir="ltr"
                    value={b.accountNumber}
                    onChange={(e) =>
                      updateBank(i, { accountNumber: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold">العملة</span>
                  <input
                    className="input-pill bg-white"
                    value={b.currency}
                    onChange={(e) => updateBank(i, { currency: e.target.value })}
                  />
                </label>
                {banks.length > 1 && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600 hover:underline"
                    onClick={() => removeBank(i)}
                  >
                    حذف الحساب
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={save}>
            حفظ الإعدادات
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setConfirmReset(true)}
          >
            إعادة للافتراضي
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title="إعادة الإعدادات؟"
        description="ستُستعاد قيم المتجر والواتساب والحسابات البنكية الافتراضية."
        confirmLabel="إعادة"
        tone="danger"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetSettings();
          setConfirmReset(false);
          showToast("تمت إعادة الإعدادات الافتراضية", "info");
        }}
      />
    </AdminShell>
  );
}
