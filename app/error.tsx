"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-pad py-16 sm:py-20">
      <ErrorState
        title="تعذّر عرض الصفحة"
        description="حدث خطأ أثناء تحميل المحتوى. يمكنكِ إعادة المحاولة أو العودة للرئيسية والتصفح من هناك."
        onRetry={reset}
      />
    </div>
  );
}
