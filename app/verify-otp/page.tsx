"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { OtpInput } from "@/components/auth/OtpInput";
import {
  ensureCustomerAuthHydrated,
  isValidMockOtp,
  MOCK_OTP_HINT,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";
import { useToastStore } from "@/lib/store/toast";
import { PageSkeleton } from "@/components/ui/Skeleton";

const RESEND_SECONDS = 30;

function safeNext(raw: string | null): string {
  if (!raw) return "/account";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/admin")) {
    return "/account";
  }
  return raw;
}

function purposeLabel(purpose: string): string {
  if (purpose === "reset") return "استعادة كلمة المرور";
  if (purpose === "register") return "تأكيد التسجيل";
  return "التحقق من الرمز";
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams.get("purpose") || "register";
  const contact = searchParams.get("contact") || "";
  const userId = searchParams.get("userId") || "";
  const next = safeNext(searchParams.get("next"));

  const activateSession = useCustomerAuthStore((s) => s.activateSession);
  const showToast = useToastStore((s) => s.show);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    ensureCustomerAuthHydrated();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidMockOtp(code)) {
      setError("أدخلي رمزًا مكوّنًا من ٦ أرقام");
      return;
    }
    setLoading(true);

    // Mock accept: demo hint or any 6 digits
    window.setTimeout(() => {
      setLoading(false);
      if (purpose === "reset") {
        showToast("تم التحقق — أدخلي كلمة مرور جديدة", "success");
        const q = new URLSearchParams();
        if (contact) q.set("contact", contact);
        router.replace(`/reset-password?${q.toString()}`);
        return;
      }

      if (purpose === "register" && userId) {
        const result = activateSession(userId);
        if (!result.ok) {
          setError(result.error);
          return;
        }
      }

      showToast("تم التحقق بنجاح 🌸", "success");
      router.replace(next);
    }, 350);
  }

  function onResend() {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
    setCode("");
    setError("");
    showToast("أُعيد إرسال الرمز (تجريبي)", "info");
  }

  const masked =
    contact.length > 4
      ? `${contact.slice(0, 3)}••••${contact.slice(-2)}`
      : contact || "رقمك/بريدك";

  return (
    <AuthCard
      title={purposeLabel(purpose)}
      subtitle={`أدخلي الرمز المرسل إلى ${masked}`}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <OtpInput value={code} onChange={setCode} disabled={loading} />

        <p className="rounded-2xl bg-cream-50 px-3.5 py-2.5 text-center text-[11px] leading-relaxed text-ink-muted">
          تجريبي: استخدمي{" "}
          <button
            type="button"
            className="font-bold text-henna underline-offset-2 hover:underline"
            onClick={() => {
              setCode(MOCK_OTP_HINT);
              setError("");
            }}
          >
            {MOCK_OTP_HINT}
          </button>{" "}
          أو أي ٦ أرقام
        </p>

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
          disabled={loading || code.length < 6}
        >
          {loading ? "جاري التحقق…" : "تأكيد الرمز"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-ink-muted">
        لم يصلكِ الرمز؟{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={cooldown > 0}
          className="font-bold text-henna disabled:cursor-not-allowed disabled:text-ink-light"
        >
          {cooldown > 0 ? `إعادة الإرسال بعد ${cooldown}ث` : "إعادة الإرسال"}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-ink-muted">
        <Link href="/login" className="font-semibold text-henna hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
