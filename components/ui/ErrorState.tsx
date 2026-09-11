"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export function ErrorState({
  title = "حدث خطأ غير متوقع",
  description = "تعذّر تحميل هذه الصفحة. جرّبي مرة أخرى أو عودي للرئيسية.",
  onRetry,
  homeHref = "/",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  homeHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertCircle className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary">
            <RefreshCw className="h-4 w-4" />
            إعادة المحاولة
          </button>
        )}
        <Link href={homeHref} className="btn-outline">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
