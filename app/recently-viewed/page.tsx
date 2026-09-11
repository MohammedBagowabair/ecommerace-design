"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import { getProductById } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function RecentlyViewedPage() {
  const ids = useRecentlyViewedStore((s) => s.ids);
  const clear = useRecentlyViewedStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="container-pad py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">شاهدتِ مؤخرًا</h1>
          <p className="page-subtitle">
            {products.length
              ? `${products.length} نقشة تصفحتهاِ مؤخرًا`
              : "ستظهر هنا النقشات التي تزورين صفحاتها"}
          </p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            className="text-sm font-semibold text-ink-light underline-offset-2 hover:text-henna hover:underline"
            onClick={() => setConfirmClear(true)}
          >
            مسح السجل
          </button>
        )}
      </div>

      <div className="mt-6">
        {!products.length ? (
          <EmptyState
            icon="recent"
            title="لا يوجد سجل مشاهدة بعد"
            description="تصفحي النقشات وستُحفظ آخر ما رأيتِه هنا تلقائيًا."
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="مسح سجل المشاهدة؟"
        description="سيتم حذف قائمة النقشات التي شاهدتِها مؤخرًا من هذا الجهاز."
        confirmLabel="مسح السجل"
        cancelLabel="إبقاء"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          clear();
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
