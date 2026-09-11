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
    <div className="container-pad overflow-x-clip py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-henna hover:underline"
        >
          <ChevronLeft className="h-4 w-4 rotate-180" />
          الرئيسية
        </Link>
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
              {subtitle}
            </p>
          )}
        </header>
        <article
          className={cn(
            "rounded-3xl bg-white p-5 shadow-card sm:p-8",
            "prose-naqshat space-y-4 text-[15px] leading-8 text-ink-muted",
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
    <section className="space-y-2">
      <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
      <div className="space-y-2 text-ink-muted">{children}</div>
    </section>
  );
}

export function ContentList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 ps-5 marker:text-henna">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
