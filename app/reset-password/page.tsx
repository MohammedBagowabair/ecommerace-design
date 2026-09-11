"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  ensureCustomerAuthHydrated,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";
import { PageSkeleton } from "@/components/ui/Skeleton";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contact = searchParams.get("contact") || "";

  const resetPassword = useCustomerAuthStore((s) => s.resetPassword);
  const showToast = useToastStore((s) => s.show);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureCustomerAuthHydrated();
  }, []);

  useEffect(() => {
    if (!contact) {
      router.replace("/forgot-password");
    }
  }, [contact, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    const result = resetPassword(contact, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("تم تحديث كلمة المرور — سجّلي دخولكِ", "success");
    router.replace("/login");
  }

  if (!contact) {
    return <PageSkeleton />;
  }

  return (
    <AuthCard
      title="كلمة مرور جديدة"
      subtitle={`تعيين كلمة مرور لحساب ${contact}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField
          label="كلمة المرور الجديدة"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />
        <PasswordField
          label="تأكيد كلمة المرور"
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
          className="btn-primary w-full min-h-[3rem] text-base"
          disabled={loading}
        >
          {loading ? "جاري الحفظ…" : "حفظ كلمة المرور"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        <Link href="/login" className="font-bold text-henna hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
