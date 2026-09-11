"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { StarPicker } from "@/components/ui/StarPicker";
import { useCustomerStore } from "@/lib/store/customer";
import { useReviewsStore } from "@/lib/store/reviews";
import { useToastStore } from "@/lib/store/toast";
import { getProductById } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 3;
const MAX_FILE_BYTES = 400_000;

export type ReviewTarget = {
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
};

export function ReviewModal({
  open,
  target,
  onClose,
}: {
  open: boolean;
  target: ReviewTarget | null;
  onClose: () => void;
}) {
  const profile = useCustomerStore((s) => s.profile);
  const addReview = useReviewsStore((s) => s.addReview);
  const hasReviewed = useReviewsStore((s) => s.hasReviewed);
  const showToast = useToastStore((s) => s.show);
  const fileRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setRating(0);
    setComment("");
    setImages([]);
    setError(null);
    setSubmitting(false);
  }, [open, target?.productId, target?.orderId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !target) return null;

  const already = hasReviewed(target.orderId, target.productId);

  const onPickFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`يمكنكِ إرفاق حتى ${MAX_IMAGES} صور`);
      return;
    }
    const selected = Array.from(files).slice(0, remaining);
    const next: string[] = [];
    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        setError("يُسمح بملفات الصور فقط");
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError("حجم الصورة كبير — اختاري صورة أصغر من ~400 كيلوبايت");
        continue;
      }
      const dataUrl = await readFileAsDataUrl(file);
      next.push(dataUrl);
    }
    if (next.length) {
      setImages((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
      setError(null);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (already) {
      setError("قيّمتِ هذه النقشة مسبقًا لهذا الطلب");
      return;
    }
    if (rating < 1) {
      setError("اختاري عدد النجوم");
      return;
    }
    if (!comment.trim()) {
      setError("اكتبي تعليقًا قصيرًا عن تجربتكِ");
      return;
    }
    setSubmitting(true);
    const product = getProductById(target.productId);
    addReview({
      productId: target.productId,
      orderId: target.orderId,
      productName: target.productName,
      productImage: target.productImage,
      productSlug: product?.slug,
      author: profile.name?.trim() || "زبونة نقشات",
      rating,
      comment,
      images,
    });
    showToast("تم إرسال تقييمك بنجاح", "success");
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white shadow-float sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cream-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 id="review-modal-title" className="text-lg font-bold text-ink">
              قيّمي النقشة
            </h2>
            <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">
              {target.productName}
            </p>
          </div>
          <button
            type="button"
            aria-label="إغلاق"
            onClick={onClose}
            className="rounded-full p-2 text-ink-muted hover:bg-cream-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-5">
          {already ? (
            <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              لقد قيّمتِ هذه النقشة مسبقًا لهذا الطلب.
            </p>
          ) : (
            <>
              <StarPicker value={rating} onChange={setRating} />

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-1.5 block text-sm font-semibold text-ink"
                >
                  تعليقكِ
                </label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={600}
                  placeholder="شاركي تجربتكِ مع هذه النقشة…"
                  className="textarea-field"
                />
                <p className="mt-1 text-end text-[11px] text-ink-light">
                  {comment.length}/600
                </p>
              </div>

              <div>
                <p className="mb-1.5 text-sm font-semibold text-ink">
                  صور اختيارية{" "}
                  <span className="font-normal text-ink-light">
                    (حتى {MAX_IMAGES})
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-16 w-16 overflow-hidden rounded-xl bg-cream-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="حذف الصورة"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute end-0.5 top-0.5 rounded-full bg-ink/70 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={cn(
                        "flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-xl border border-dashed border-cream-300 bg-cream-50 text-ink-muted transition hover:border-henna-300 hover:text-henna"
                      )}
                    >
                      <ImagePlus className="h-5 w-5" />
                      <span className="text-[10px]">إضافة</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    void onPickFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {error && (
                <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                إرسال التقييم
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
