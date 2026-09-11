"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import {
  ContentPageLayout,
  ContentSection,
} from "@/components/content/ContentPageLayout";
import { brand } from "@/lib/data";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function ContactPage() {
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const showToast = useToastStore((s) => s.show);
  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensureSeeded();
    setMounted(true);
  }, [ensureSeeded]);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const storeName = settings.storeName || brand.name;
  const whatsapp = settings.whatsapp || "967700000000";
  const whatsappDisplay = settings.whatsappDisplay || "+967 700 000 000";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setName("");
      setPhone("");
      setMessage("");
      showToast("وصلت رسالتكِ (تجريبي) — سنرد قريبًا 🌸", "success");
    }, 400);
  }

  return (
    <ContentPageLayout
      title="تواصل معنا"
      subtitle={`فريق ${storeName} جاهز لمساعدتكِ في الطلبات والعروض والاستفسارات.`}
    >
      <ContentSection title="قنوات سريعة">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-sm font-bold text-white transition hover:opacity-95"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
            واتساب {whatsappDisplay}
          </a>
          <a
            href={`tel:+${whatsapp}`}
            className="btn-outline inline-flex min-h-[3rem] flex-1 gap-2"
          >
            <Phone className="h-4 w-4" strokeWidth={1.75} />
            اتصال
          </a>
        </div>
      </ContentSection>

      <ContentSection title="رسالة سريعة">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              الاسم
            </span>
            <input
              className="input-field min-h-[3rem] text-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمكِ"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              الجوال{" "}
              <span className="font-normal text-ink-light">(اختياري)</span>
            </span>
            <input
              className="input-field min-h-[3rem] text-base"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="77xxxxxxx"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              الرسالة
            </span>
            <textarea
              className="textarea-field min-h-[8rem] text-base"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتبي استفساركِ هنا…"
              required
            />
          </label>
          <button
            type="submit"
            className="btn-primary w-full min-h-[3rem] text-base sm:w-auto"
            disabled={loading}
          >
            {loading ? "جاري الإرسال…" : "إرسال الرسالة"}
          </button>
          <p className="text-[11px] text-ink-light">
            النموذج تجريبي — لا يُرسل إلى خادم حقيقي في هذا النموذج.
          </p>
        </form>
      </ContentSection>
    </ContentPageLayout>
  );
}
