"use client";

import { useMemo, useState } from "react";
import type { Review } from "@/lib/types";
import {
  formatReviewDate,
  getReviewDistribution,
} from "@/lib/data/reviews";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

export function ProductReviews({
  reviews,
  productRating,
  productReviewCount,
}: {
  reviews: Review[];
  /** Fallback when list empty — product catalog fields */
  productRating?: number;
  productReviewCount?: number;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const dist = useMemo(() => getReviewDistribution(reviews), [reviews]);
  const average =
    dist.total > 0 ? dist.average : productRating ?? 0;
  const total =
    dist.total > 0 ? dist.total : productReviewCount ?? 0;

  const sorted = useMemo(
    () =>
      [...reviews].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [reviews]
  );

  return (
    <section className="mt-12">
      <h2 className="section-title mb-4">آراء الزبونات</h2>

      <div className="mb-6 grid gap-4 rounded-3xl bg-white p-5 shadow-card sm:grid-cols-[auto_1fr] sm:p-6">
        <div className="flex flex-col items-center justify-center gap-2 border-b border-cream-200 pb-4 sm:border-b-0 sm:border-e sm:pe-8 sm:pb-0">
          <p className="text-4xl font-bold text-henna">{average.toFixed(1)}</p>
          <StarRating rating={average} size="md" />
          <p className="text-xs text-ink-muted">
            {total > 0 ? `${total} تقييم` : "لا توجد تقييمات بعد"}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {([5, 4, 3, 2, 1] as const).map((star) => {
            const count = dist.counts[star];
            const pct = dist.total ? Math.round((count / dist.total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-10 shrink-0 text-ink-muted">{star} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream-100">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-end text-ink-light">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-sm text-ink-muted shadow-card">
          لا توجد مراجعات بعد لهذا المنتج. كوني أول من يقيّم!
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((r) => (
            <li key={r.id}>
              <article className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-ink">{r.author}</h3>
                    <p className="mt-0.5 text-[11px] text-ink-light">
                      {formatReviewDate(r.date)}
                    </p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {r.comment}
                </p>
                {r.images && r.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.images.map((src, i) => (
                      <button
                        key={`${r.id}-img-${i}`}
                        type="button"
                        onClick={() => setLightbox(src)}
                        className={cn(
                          "relative h-16 w-16 overflow-hidden rounded-xl bg-cream-100 ring-1 ring-cream-200 transition hover:ring-henna-300"
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`صورة من تقييم ${r.author}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[85vh] max-w-lg overflow-hidden rounded-2xl bg-white shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="صورة التقييم"
              className="max-h-[85vh] w-full object-contain"
            />
            <button
              type="button"
              className="absolute end-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs text-white"
              onClick={() => setLightbox(null)}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
