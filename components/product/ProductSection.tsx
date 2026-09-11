import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export function ProductSection({
  title,
  subtitle,
  eyebrow,
  href,
  products,
  linkLabel = "عرض الكل",
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  href?: string;
  products: Product[];
  linkLabel?: string;
  tone?: "default" | "blush" | "cream";
}) {
  if (!products.length) return null;

  return (
    <section
      className={cn(
        "py-10 sm:py-12",
        tone === "blush" && "bg-blush/40",
        tone === "cream" && "bg-cream-200/40"
      )}
    >
      <div className="container-pad">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h2 className="section-title mt-1">{title}</h2>
            {subtitle && (
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">
                {subtitle}
              </p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold text-henna transition hover:bg-henna-50 hover:text-henna-600"
            >
              {linkLabel}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="hide-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <div key={p.id} className="w-[min(12rem,44vw)] shrink-0 sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
