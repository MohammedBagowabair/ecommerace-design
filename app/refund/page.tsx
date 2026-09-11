import type { Metadata } from "next";
import {
  ContentList,
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع والاستبدال",
};

export default function RefundPage() {
  return (
    <ContentPageLayout
      title="سياسة الاسترجاع والاستبدال"
      subtitle={`نحرص في ${brand.name} على رضاكِ، مع مراعاة طبيعة المنتج (استكيرات حناء).`}
    >
      <ContentSection title="متى يمكن الاستبدال؟">
        <ContentList
          items={[
            "وصول منتج مختلف عن الطلب المؤكد.",
            "عيب تصنيع واضح أو تلف ظاهر عند الاستلام.",
            "نقص في محتويات الطرد مقارنة بما في الفاتورة.",
          ]}
        />
      </ContentSection>

      <ContentSection title="ما الذي لا يُسترجع عادة؟">
        <p>
          الاستكيرات المفتوحة أو المستخدمة لا تُسترجع لأسباب صحية وصحية للمنتج،
          إلا إذا ثبت عيب تصنيع قبل الاستخدام وبصورة موثّقة.
        </p>
      </ContentSection>

      <ContentSection title="المدة والإجراء">
        <ContentList
          items={[
            "أبلِغي الدعم خلال ٤٨ ساعة من الاستلام مع صور واضحة للطرد والمنتج.",
            "احتفظي بعبوة الشحن إن أمكن لتسهيل المراجعة.",
            "بعد الموافقة نرتّب استبدالًا أو حلًا مناسبًا حسب الحالة.",
          ]}
        />
      </ContentSection>

      <ContentSection title="التواصل">
        <p>
          للاستفسار عن طلب معيّن، استخدمي صفحة{" "}
          <a href="/contact" className="font-semibold text-henna hover:underline">
            تواصل معنا
          </a>{" "}
          أو واتساب المتجر مع رقم الطلب.
        </p>
      </ContentSection>
    </ContentPageLayout>
  );
}
