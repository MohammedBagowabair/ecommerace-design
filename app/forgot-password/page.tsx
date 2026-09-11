"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import {
  ensureCustomerAuthHydrated,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";
import { PageSkeleton } from "@/components/ui/Skeleton";

function ForgotPasswordForm() {
  const router = useRouter();
  const session = useCustomerAuthStore((s) => s.session);
  const hydrated = useCustomerAuthStore((s) => s.hydrated);
  const findUserByIdentifier = useCustomerAuthStore((s) => s.findUserByIdentifier);
  const showToast = useToastStore((s) => s.show);

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureCustomerAuthHydrated();
  }, []);

  useEffect(() => {
    if (hydrated && session) {
      router.replace("/account/change-password");
    }
  }, [hydrated, session, router]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const id = identifier.trim();
    if (!id) {
      setError("أدخلي رقم الجوال أو البريد");
      return;
    }
    setLoading(true);
    // Soft check — mock still proceeds with toast if unknown (demo UX)
    const user = findUserByIdentifier(id);
    window.setTimeout(() => {
      setLoading(false);
      if (!user) {
        setError(
          "لم نجد حسابًا بهذه البيانات. جرّبي sara@example.com أو 777123456 للتجربة."
        );
        return;
      }
      showToast("تم إرسال رمز التحقق (تجريبي)", "success");
      const q = new URLSearchParams({
        purpose: "reset",
        contact: id,
      });
      router.push(`/verify-otp?${q.toString()}`);
    }, 400);
  }

  if (hydrated && session) {
    return <PageSkeleton />;
  }

  return (
    <AuthCard
      title="نسيتِ كلمة المرور؟"
      subtitle="أدخلي الجوال أو البريد لنرسل رمز التحقق"
    >
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
          {loading ? "جاري الإرسال…" : "إرسال رمز التحقق"}
        </button>
      </form>

      <p className="mt-5 rounded-2xl bg-cream-50 px-3.5 py-2.5 text-center text-[11px] text-ink-muted">
        تجريبي: الحساب الجاهز{" "}
        <span className="font-semibold text-henna">sara@example.com</span>
      </p>

      <p className="mt-5 text-center text-sm text-ink-muted">
        تذكرتِ كلمة المرور؟{" "}
        <Link href="/login" className="font-bold text-henna hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
