"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone } from "lucide-react";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const session = useCustomerAuthStore((s) => s.session);
  const hydrated = useCustomerAuthStore((s) => s.hydrated);
  const login = useCustomerAuthStore((s) => s.login);
  const loginWithGoogle = useCustomerAuthStore((s) => s.loginWithGoogle);
  const showToast = useToastStore((s) => s.show);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);
    const result = login(identifier, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("تم تسجيل الدخول بنجاح 🌸", "success");
    router.replace(next);
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
    <AuthCard title="تسجيل الدخول" subtitle="مرحبًا بعودتكِ إلى نقشات">
      <GoogleMockButton onSuccess={onGoogle} />
      <AuthDivider />

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            البريد أو رقم الجوال
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute start-3.5 top-1/2 flex -translate-y-1/2 items-center gap-1 text-ink-light">
              <Mail className="h-4 w-4" strokeWidth={1.75} />
              <Phone className="hidden h-3.5 w-3.5 sm:inline" strokeWidth={1.75} />
            </span>
            <input
              type="text"
              inputMode="email"
              autoComplete="username"
              className="input-field min-h-[3rem] rounded-2xl ps-12 text-base"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="sara@example.com أو 777123456"
              required
            />
          </div>
        </label>

        <PasswordField
          label="كلمة المرور"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-henna hover:underline"
          >
            نسيتِ كلمة المرور؟
          </Link>
        </div>

        {error && (
          <p
            className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full min-h-[3rem] text-base" disabled={loading}>
          {loading ? "جاري الدخول…" : "تسجيل الدخول"}
        </button>
      </form>

      <p className="mt-5 rounded-2xl bg-cream-50 px-3.5 py-2.5 text-center text-[11px] text-ink-muted">
        تجريبي:{" "}
        <button
          type="button"
          className="font-semibold text-henna underline-offset-2 hover:underline"
          onClick={() => {
            setIdentifier("sara@example.com");
            setPassword("demo123");
            setError("");
          }}
        >
          sara@example.com / demo123
        </button>
      </p>

      <p className="mt-5 text-center text-sm text-ink-muted">
        ليس لديكِ حساب؟{" "}
        <Link
          href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-bold text-henna hover:underline"
        >
          إنشاء حساب
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
