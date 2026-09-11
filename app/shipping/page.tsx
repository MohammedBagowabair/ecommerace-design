"use client";

import { useEffect, useState } from "react";
import {
  ContentList,
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";
import { resolveDeliveryCopy } from "@/lib/delivery-settings";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function ShippingPage() {
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setMounted(true);
  }, [ensureSeeded]);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const delivery = resolveDeliveryCopy(settings);

  return (
    <ContentPageLayout
      title="سياسة الشحن والتوصيل"
      subtitle={`تفاصيل التوصيل والاستلام في متجر ${brand.name}.`}
    >
      <ContentSection title={delivery.deliveryLabel}>
        <p>
          المدة المتوقعة:{" "}
          <strong className="text-ink">{delivery.deliveryEta}</strong>.
        </p>
        <p>{delivery.deliveryText}</p>
      </ContentSection>

      {delivery.pickupEnabled && (
        <ContentSection title={delivery.pickupLabel}>
          <p>{delivery.pickupText}</p>
        </ContentSection>
      )}

      <ContentSection title="مناطق التوصيل">
        <p>
          نوصل داخل المدن المغطاة حسب شبكة التوزيع الحالية. عند الطلب أدخلي
          المدينة والمنطقة بدقة لتقدير أفضل ولتجنب تأخير التواصل.
        </p>
      </ContentSection>

      <ContentSection title="تتبع الطلب">
        <ContentList
          items={[
            "تابعي حالة الطلب من صفحة طلباتي بعد تسجيل الدخول.",
            "قد يتواصل معكِ فريق التوصيل عبر واتساب أو الجوال المسجّل.",
            "تأكدي من أن رقم الجوال صحيح ويستقبل الرسائل.",
          ]}
        />
      </ContentSection>

      <ContentSection title="رسوم التوصيل">
        <p>
          تظهر رسوم التوصيل عند إتمام الطلب حسب الخيار المختار. خيار الاستلام من
          المتجر — إن كان مفعّلًا — يكون مجانيًا عادة.
        </p>
      </ContentSection>
    </ContentPageLayout>
  );
}
