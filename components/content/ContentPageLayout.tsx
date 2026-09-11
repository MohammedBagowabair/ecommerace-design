import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContentPageLayout({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="container-pad overflow-x-clip py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-henna transition hover:text-henna-700"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={1.75} />
          الرئيسية
        </Link>
        <header className="mb-8 sm:mb-10">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              {subtitle}
            </p>
          )}
          <div className="mt-5 h-px w-10 bg-gold-400/50" aria-hidden />
        </header>
        <article
          className={cn(
            "rounded-[1.75rem] bg-[#FFFCFA] p-6 shadow-gallery sm:p-9",
            "prose-naqshat space-y-5 text-[15px] leading-8 text-ink-muted",
            className
          )}
        >
          {children}
        </article>
      </div>
    </div>
  );
}

export function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h2 className="font-display text-base font-semibold text-ink sm:text-lg">{title}</h2>
      <div className="space-y-2 text-ink-muted">{children}</div>
    </section>
  );
}

export function ContentList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 ps-5 marker:text-gold-500">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
