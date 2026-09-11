import type { Metadata } from "next";
import {
  ContentList,
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout
      title="سياسة الخصوصية"
      subtitle={`كيف نحمي بياناتكِ عند التسوّق من ${brand.name} (نسخة تجريبية للمتجر).`}
    >
      <ContentSection title="ما البيانات التي نجمعها؟">
        <ContentList
          items={[
            "الاسم ورقم الجوال والبريد عند إنشاء الحساب أو إتمام الطلب.",
            "عنوان التوصيل الذي تختارينه أو تضيفينه.",
            "تفاصيل الطلبات والتقييمات داخل حسابكِ.",
          ]}
        />
      </ContentSection>

      <ContentSection title="لماذا نستخدمها؟">
        <p>
          لمعالجة الطلبات، التواصل بشأن التوصيل أو الدفع، وتحسين تجربة التسوق.
          لا نبيع بياناتكِ الشخصية لأطراف خارجية لأغراض تسويقية.
        </p>
      </ContentSection>

      <ContentSection title="التخزين والأمان">
        <p>
          في هذا النموذج التجريبي تُحفظ بيانات الحساب محليًا في متصفحكِ لأغراض
          العرض. في النسخة الإنتاجية ستُخزَّن على خوادم محمية مع ضوابط وصول
          مناسبة.
        </p>
      </ContentSection>

      <ContentSection title="حقوقكِ">
        <ContentList
          items={[
            "طلب تصحيح بيانات الحساب من صفحة معلوماتي.",
            "التواصل معنا عبر صفحة تواصل معنا لأي استفسار خصوصية.",
            "حذف الحساب عند تفعيل الخدمة الإنتاجية وفق الإجراءات المعتمدة.",
          ]}
        />
      </ContentSection>
    </ContentPageLayout>
  );
}
