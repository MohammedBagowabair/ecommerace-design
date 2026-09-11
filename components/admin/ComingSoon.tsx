import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description = "هذه الصفحة قيد التطوير وستكون متاحة قريبًا.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-henna-200 bg-white px-6 py-16 text-center shadow-card">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-henna-50 text-henna">
        <Construction className="h-7 w-7" strokeWidth={1.75} />
      </div>
      <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>
      <span className="mt-4 inline-flex rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
        قريبًا
      </span>
    </div>
  );
}
