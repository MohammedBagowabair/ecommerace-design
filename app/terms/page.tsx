import type { Metadata } from "next";
import {
  ContentList,
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
};

export default function TermsPage() {
  return (
    <ContentPageLayout
      title="الشروط والأحكام"
      subtitle={`باستخدام متجر ${brand.name} فإنكِ توافقين على الشروط التالية.`}
    >
      <ContentSection title="استخدام المتجر">
        <p>
          المتجر مخصص لبيع استكيرات نقشات الحناء ومنتجات ذات صلة. يُفترض أن تكون
          البيانات التي تقدّمينها صحيحة وكاملة لإتمام الطلب والتواصل.
        </p>
      </ContentSection>

      <ContentSection title="الطلبات والدفع">
        <ContentList
          items={[
            "يتم تأكيد الطلب بعد مراجعة البيانات وتوفر المخزون.",
            "الدفع حاليًا عبر التحويل البنكي وفق الحسابات المعروضة عند الدفع.",
            "قد يُؤجَّل الشحن حتى وصول إثبات التحويل عند الحاجة.",
          ]}
        />
      </ContentSection>

      <ContentSection title="الأسعار والتوفر">
        <p>
          الأسعار تظهر بالريال اليمني وقد تتغيّر مع العروض. توفر المنتجات يخضع
          للمخزون الظاهر وقت الطلب، وقد نبلغكِ بأي تعديل قبل الشحن.
        </p>
      </ContentSection>

      <ContentSection title="الملكية الفكرية">
        <p>
          جميع التصاميم، الصور، والعلامة التجارية {brand.name} محمية. لا يُسمح
          بإعادة استخدامها تجاريًا دون إذن.
        </p>
      </ContentSection>

      <ContentSection title="تعديل الشروط">
        <p>
          قد نحدّث هذه الصفحة عند الحاجة. استمرار استخدام المتجر بعد التحديث يعني
          الموافقة على النسخة الأحدث المنشورة هنا.
        </p>
      </ContentSection>
    </ContentPageLayout>
  );
}
