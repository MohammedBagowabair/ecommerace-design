"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone, User } from "lucide-react";
import { AuthCard, AuthDivider } from "@/components/auth/AuthCard";
import { GoogleMockButton } from "@/components/auth/GoogleMockButton";
import { PasswordField } from "@/components/auth/PasswordField";
import {
  ensureCustomerAuthHydrated,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";
import { PageSkeleton } from "@/components/ui/Skeleton";

function safeNext(raw: string | null): string {
  if (!raw) return "/account";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/admin")) {
    return "/account";
  }
  return raw;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const session = useCustomerAuthStore((s) => s.session);
  const hydrated = useCustomerAuthStore((s) => s.hydrated);
  const register = useCustomerAuthStore((s) => s.register);
  const loginWithGoogle = useCustomerAuthStore((s) => s.loginWithGoogle);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureCustomerAuthHydrated();
    const t = window.setTimeout(() => {
      if (!useCustomerAuthStore.getState().hydrated) {
        useCustomerAuthStore.getState().setHydrated(true);
      }
    }, 40);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated && session) {
      router.replace(next);
    }
  }, [hydrated, session, router, next]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    const result = register(
      { name, phone, email, password },
      { autoLogin: false }
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("تم إنشاء الحساب — أكّدي برمز التحقق", "success");
    const q = new URLSearchParams({
      purpose: "register",
      userId: result.userId,
      contact: result.contact,
      next,
    });
    router.replace(`/verify-otp?${q.toString()}`);
  }

  function onGoogle() {
    loginWithGoogle();
    showToast("تم الدخول عبر Google (تجريبي)", "success");
    router.replace(next);
  }

  if (hydrated && session) {
    return <PageSkeleton />;
  }

  return (
    <AuthCard title="إنشاء حساب" subtitle="سجّلي بسرعة — خاصةً من الجوال">
      <GoogleMockButton onSuccess={onGoogle} />
      <AuthDivider />

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">الاسم</span>
          <div className="relative">
            <User
              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              strokeWidth={1.75}
            />
            <input
              type="text"
              autoComplete="name"
              className="input-field min-h-[3rem] rounded-2xl ps-10 text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سارة أحمد"
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            رقم الجوال <span className="text-henna">*</span>
          </span>
          <div className="relative">
            <Phone
              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              strokeWidth={1.75}
            />
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="input-field min-h-[3rem] rounded-2xl ps-10 text-base"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="77xxxxxxx"
              required
            />
          </div>
          <p className="mt-1 text-[11px] text-ink-light">مطلوب لسوق اليمن — رقم يمني</p>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            البريد الإلكتروني{" "}
            <span className="font-normal text-ink-light">(اختياري)</span>
          </span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
              strokeWidth={1.75}
            />
            <input
              type="email"
              autoComplete="email"
              className="input-field min-h-[3rem] rounded-2xl ps-10 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
        </label>

        <PasswordField
          label="كلمة المرور"
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

        <button type="submit" className="btn-primary w-full min-h-[3rem] text-base" disabled={loading}>
          {loading ? "جاري الإنشاء…" : "إنشاء حساب"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        لديكِ حساب؟{" "}
        <Link
          href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-bold text-henna hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
