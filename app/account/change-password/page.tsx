"use client";

import { FormEvent, useState } from "react";
import { AccountShell } from "@/components/account/AccountNav";
import { PasswordField } from "@/components/auth/PasswordField";
import { useCustomerAuthStore } from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";

export default function ChangePasswordPage() {
  const changePassword = useCustomerAuthStore((s) => s.changePassword);
  const session = useCustomerAuthStore((s) => s.session);
  const showToast = useToastStore((s) => s.show);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setError("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }
    setLoading(true);
    const result = changePassword(current, next);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCurrent("");
    setNext("");
    setConfirm("");
    showToast("تم تغيير كلمة المرور بنجاح", "success");
  }

  const isGoogle = session?.provider === "google";

  return (
    <AccountShell
      title="تغيير كلمة المرور"
      subtitle="حدّثي كلمة مرور حسابكِ (تجريبي — محفوظ محليًا)"
    >
      {isGoogle ? (
        <div className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
          <p className="text-sm leading-relaxed text-ink-muted">
            حسابكِ مرتبط بتسجيل Google التجريبي، ولا يستخدم كلمة مرور محلية.
            لتغيير كلمة مرور حساب محلي، سجّلي خروجًا ثم ادخلي بحساب مثل{" "}
            <span className="font-semibold text-henna">sara@example.com</span>.
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl bg-white p-5 shadow-card sm:p-6"
        >
          <PasswordField
            label="كلمة المرور الحالية"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
            required
          />
          <PasswordField
            label="كلمة المرور الجديدة"
            value={next}
            onChange={setNext}
            autoComplete="new-password"
            required
          />
          <PasswordField
            label="تأكيد كلمة المرور الجديدة"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
          />

          {error && (
            <p
              className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary w-full min-h-[3rem] text-base sm:w-auto sm:min-w-[12rem]"
            disabled={loading}
          >
            {loading ? "جاري الحفظ…" : "حفظ التغيير"}
          </button>
        </form>
      )}
    </AccountShell>
  );
}
