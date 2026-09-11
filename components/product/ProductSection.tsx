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
        "section-pad",
        tone === "blush" && "bg-blush/30",
        tone === "cream" && "bg-cream-200/30"
      )}
    >
      <div className="container-pad">
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-7 sm:gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h2 className="section-title mt-0.5 sm:mt-1">{title}</h2>
            {subtitle && (
              <p className="section-subtitle mt-1 hidden sm:block">{subtitle}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="inline-flex min-h-10 shrink-0 items-center gap-0.5 rounded-full px-2.5 text-xs font-medium text-henna transition hover:bg-cream-100 hover:text-henna-700 sm:min-h-11 sm:gap-1 sm:px-3 sm:text-sm"
            >
              {linkLabel}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="hide-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-2 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <div
              key={p.id}
              className="w-[min(10.75rem,42vw)] shrink-0 sm:w-auto"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
