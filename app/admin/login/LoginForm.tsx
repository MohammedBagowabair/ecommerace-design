"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Shield, Sparkles } from "lucide-react";
import { brand } from "@/lib/data";
import { DEMO_ACCOUNTS } from "@/lib/admin/seed";
import { useAdminAuthStore, ensureAdminAuthHydrated } from "@/lib/store/admin-auth";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useToastStore } from "@/lib/store/toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const session = useAdminAuthStore((s) => s.session);
  const hydrated = useAdminAuthStore((s) => s.hydrated);
  const login = useAdminAuthStore((s) => s.login);
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const showToast = useToastStore((s) => s.show);

  const [email, setEmail] = useState("admin@naqshat.ye");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureAdminAuthHydrated();
    ensureSeeded();
    const t = window.setTimeout(() => {
      if (!useAdminAuthStore.getState().hydrated) {
        useAdminAuthStore.getState().setHydrated(true);
      }
      if (!useAdminDataStore.getState().hydrated) {
        useAdminDataStore.getState().setHydrated(true);
        useAdminDataStore.getState().ensureSeeded();
      }
    }, 40);
    return () => window.clearTimeout(t);
  }, [ensureSeeded]);

  useEffect(() => {
    if (hydrated && session) {
      router.replace(next.startsWith("/admin") ? next : "/admin");
    }
  }, [hydrated, session, router, next]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    ensureSeeded();
    const result = login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast("تم تسجيل الدخول بنجاح", "success");
    router.replace(next.startsWith("/admin") ? next : "/admin");
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("demo123");
    setError("");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cream px-4 py-10">
      {/* Soft decorative backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-henna-100/80 via-cream to-blush/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-24 top-20 h-64 w-64 rounded-full bg-gold-100/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-16 bottom-10 h-72 w-72 rounded-full bg-henna-100/40 blur-3xl"
      />

      <div className="relative mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-henna text-xl font-bold text-white shadow-soft">
          ن
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          مرحبًا بكِ في لوحة {brand.name}
        </h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-ink-muted">
          <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />
          إدارة الطلبات والمنتجات بهدوء وأناقة — تجريبي فقط
        </p>
      </div>

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-cream-200/80 bg-white/95 p-6 shadow-float backdrop-blur sm:p-8">
        <div className="mb-6 flex items-center gap-2.5 text-henna">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-henna-50">
            <Shield className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink">دخول الإدارة</h2>
            <p className="text-xs text-ink-light">أدخلي بياناتك للمتابعة</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-muted">البريد الإلكتروني</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" strokeWidth={1.75} />
              <input
                type="email"
                autoComplete="username"
                className="input-pill ps-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@naqshat.ye"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-muted">كلمة المرور</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" strokeWidth={1.75} />
              <input
                type="password"
                autoComplete="current-password"
                className="input-pill ps-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          {error && (
            <p className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "جاري الدخول…" : "دخول إلى اللوحة"}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-cream-200 bg-cream-50/80 p-3.5">
          <p className="mb-2.5 text-xs font-semibold text-ink-muted">حسابات تجريبية — اضغطي للتعبئة:</p>
          <ul className="space-y-1.5">
            {DEMO_ACCOUNTS.map((a) => (
              <li key={a.email}>
                <button
                  type="button"
                  onClick={() => fillDemo(a.email)}
                  className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-start text-xs transition hover:bg-white"
                >
                  <span className="font-medium text-ink">{a.email}</span>
                  <span className="shrink-0 rounded-full bg-henna-50 px-2.5 py-1 text-[10px] font-semibold text-henna">
                    {a.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 text-[11px] text-ink-light">كلمة المرور التجريبية: demo123</p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          <Link href="/" className="font-semibold text-henna transition hover:underline">
            العودة للمتجر
          </Link>
        </p>
      </div>
    </div>
  );
}
