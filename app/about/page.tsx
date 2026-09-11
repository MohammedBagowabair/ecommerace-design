import type { Metadata } from "next";
import {
  ContentList,
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";

export const metadata: Metadata = {
  title: "من نحن",
  description: `تعرّفي على قصة ${brand.name} لاستكيرات نقشات الحناء`,
};

export default function AboutPage() {
  return (
    <ContentPageLayout
      title="من نحن"
      subtitle={`${brand.name} — متجر نسائي فاخر لاستكيرات نقشات الحناء، بروح يمنية معاصرة.`}
    >
      <ContentSection title="قصتنا">
        <p>
          بدأت {brand.name} من حبّ التفاصيل الدقيقة في نقش الحناء التقليدي، ورغبة
          في جعله أقرب وأسهل لكل فتاة تريد إطلالة مميزة دون تعقيد. حوّلنا أجمل
          الزخارف إلى استكيرات جاهزة للتطبيق — أنيقة، سريعة، ومناسبة للمناسبات
          والإطلالات اليومية.
        </p>
      </ContentSection>

      <ContentSection title="ماذا نقدّم؟">
        <ContentList
          items={[
            "تصاميم عصرية للمناسبات: زفاف، خطوبة، عيد، وسهرات.",
            "نقشات يومية خفيفة تضيف لمسة أنوثة بسيطة.",
            "مجموعات مختارة بعناية مع صور واضحة وتفاصيل المقاس.",
            "تجربة تسوّق عربية سهلة من الجوال أولًا.",
          ]}
        />
      </ContentSection>

      <ContentSection title="قيمنا">
        <p>
          نهتم بالجودة والوضوح قبل كل شيء: صور صادقة، وصف دقيق، وتوصيل منظم حسب
          أيام العمل. نريد أن تشعري بالثقة من أول لمسة في المتجر وحتى وصول طلبكِ.
        </p>
      </ContentSection>

      <ContentSection title="لمن صُممت نقشات؟">
        <p>
          لكل من تحبّ الحناء كفنّ وزينة — من العروس التي تجهّز ليلتها، إلى الفتاة
          التي تريد لمسة سريعة قبل الخروج. {brand.tagline}.
        </p>
      </ContentSection>
    </ContentPageLayout>
  );
}
