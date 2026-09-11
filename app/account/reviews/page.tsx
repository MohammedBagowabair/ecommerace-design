"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AccountShell } from "@/components/account/AccountNav";
import { StarRating } from "@/components/ui/StarRating";
import { formatReviewDate } from "@/lib/data/reviews";
import { useReviewsStore } from "@/lib/store/reviews";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function MyReviewsPage() {
  const reviews = useReviewsStore((s) => s.reviews);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PageSkeleton />;
  }

  return (
    <AccountShell
      title="تقييماتي"
      subtitle={
        reviews.length
          ? `${reviews.length} تقييم أرسلتيه`
          : "تقييماتكِ للمنتجات المستلمة"
      }
    >
      {reviews.length === 0 ? (
        <EmptyState
          icon="reviews"
          title="لا توجد تقييمات بعد"
          description="بعد استلام طلبكِ، يمكنكِ تقييم النقشات من تفاصيل الطلب بزر قيّمي النقشة."
          actionHref="/account/orders"
          actionLabel="عرض طلباتي"
          secondaryHref="/products"
          secondaryLabel="تصفحي النقشات"
        />
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => {
            const href = r.productSlug
              ? `/products/${r.productSlug}`
              : "/products";
            return (
              <li key={r.id}>
                <article className="rounded-3xl bg-white p-4 shadow-card sm:p-5">
                  <div className="flex gap-3">
                    <Link
                      href={href}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-cream-100"
                    >
                      <Image
                        src={r.productImage}
                        alt={r.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <Link
                            href={href}
                            className="font-bold text-ink hover:text-henna"
                          >
                            {r.productName}
                          </Link>
                          <p className="mt-0.5 text-[11px] text-ink-light">
                            {formatReviewDate(r.date)}
                            {" · "}
                            طلب{" "}
                            <span dir="ltr">{r.orderId}</span>
                          </p>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                        {r.comment}
                      </p>
                      {r.images && r.images.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.images.map((src, i) => (
                            <span
                              key={`${r.id}-img-${i}`}
                              className="relative h-14 w-14 overflow-hidden rounded-xl bg-cream-100 ring-1 ring-cream-200"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </AccountShell>
  );
}
