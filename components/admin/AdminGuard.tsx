"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore, ensureAdminAuthHydrated } from "@/lib/store/admin-auth";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useAdminOpsStore } from "@/lib/store/admin-ops";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAdminAuthStore((s) => s.session);
  const hydrated = useAdminAuthStore((s) => s.hydrated);
  const dataHydrated = useAdminDataStore((s) => s.hydrated);
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const ensureOpsSeeded = useAdminOpsStore((s) => s.ensureSeeded);

  useEffect(() => {
    ensureAdminAuthHydrated();
    // Mark data hydrated if persist finished silently
    const t = window.setTimeout(() => {
      if (!useAdminDataStore.getState().hydrated) {
        useAdminDataStore.getState().setHydrated(true);
        useAdminDataStore.getState().ensureSeeded();
      }
      if (!useAdminOpsStore.getState().hydrated) {
        useAdminOpsStore.getState().setHydrated(true);
        useAdminOpsStore.getState().ensureSeeded();
      }
      if (!useAdminAuthStore.getState().hydrated) {
        useAdminAuthStore.getState().setHydrated(true);
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hydrated || dataHydrated) {
      ensureSeeded();
      ensureOpsSeeded();
    }
  }, [hydrated, dataHydrated, ensureSeeded, ensureOpsSeeded]);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/admin/login?next=${next}`);
    }
  }, [hydrated, session, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <div className="h-8 w-8 animate-pulse rounded-full bg-henna-200" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-sm text-ink-muted">جاري التحويل لتسجيل الدخول…</p>
      </div>
    );
  }

  return <>{children}</>;
}
