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
        tone === "blush" && "bg-blush",
        tone === "cream" && "bg-cream-100"
      )}
    >
      <div className="container-pad">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
          <div className="min-w-0">
            {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
            <h2 className="section-title mt-0.5">{title}</h2>
            {subtitle && (
              <p className="section-subtitle mt-1 hidden sm:block">{subtitle}</p>
            )}
          </div>
          {href && (
            <Link
              href={href}
              className="inline-flex min-h-9 shrink-0 items-center gap-0.5 rounded-md px-2 text-xs font-semibold text-ink transition hover:bg-cream-100 sm:min-h-10 sm:px-2.5 sm:text-sm"
            >
              {linkLabel}
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
        </div>
        {/* Shein-like dense 2-col grid on mobile; 4-col desktop */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
