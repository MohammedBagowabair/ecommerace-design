"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ensureCustomerAuthHydrated,
  useCustomerAuthStore,
} from "@/lib/store/customer-auth";

export function CustomerAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useCustomerAuthStore((s) => s.session);
  const hydrated = useCustomerAuthStore((s) => s.hydrated);

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
    if (!hydrated) return;
    if (!session) {
      const next = encodeURIComponent(pathname || "/account");
      router.replace(`/login?next=${next}`);
    }
  }, [hydrated, session, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-henna-200" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-sm font-semibold text-ink">يلزم تسجيل الدخول</p>
        <p className="text-sm text-ink-muted">جاري التحويل لصفحة الدخول…</p>
      </div>
    );
  }

  return <>{children}</>;
}
