"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, ChevronUp, ChevronDown, Film } from "lucide-react";
import { fileToCompressedDataUrl, isVideoSrc } from "@/lib/media/compress";
import { SafeMedia } from "@/components/media/SafeMedia";
import { cn } from "@/lib/utils";

export function MediaUploader({
  values,
  onChange,
  max = 5,
  accept = "image/*,video/*",
  label = "الوسائط",
  disabled,
  allowVideo = true,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  max?: number;
  accept?: string;
  label?: string;
  disabled?: boolean;
  allowVideo?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (files: FileList | null) => {
    if (!files?.length || disabled) return;
    const remaining = max - values.length;
    if (remaining <= 0) {
      setError(`الحد الأقصى ${max} ملفات`);
      return;
    }
    setBusy(true);
    setError(null);
    const next = [...values];
    try {
      for (const file of Array.from(files).slice(0, remaining)) {
        if (!allowVideo && file.type.startsWith("video/")) {
          setError("الفيديو غير مسموح هنا");
          continue;
        }
        const url = await fileToCompressedDataUrl(file);
        next.push(url);
      }
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر رفع الملف");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-[11px] text-ink-light">
          {values.length}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((src, i) => (
          <div
            key={`${i}-${src.slice(0, 24)}`}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-cream-300 bg-cream-50"
          >
            <SafeMedia src={src} alt="" fill className="object-cover" />
            {isVideoSrc(src) && (
              <span className="absolute start-1 top-1 rounded bg-ink/70 p-0.5 text-white">
                <Film className="h-3 w-3" />
              </span>
            )}
            {!disabled && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-0.5 bg-ink/55 p-0.5">
                <button
                  type="button"
                  className="rounded p-0.5 text-white hover:bg-white/20"
                  onClick={() => move(i, -1)}
                  aria-label="تحريك لليسار"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded p-0.5 text-white hover:bg-white/20"
                  onClick={() => move(i, 1)}
                  aria-label="تحريك لليمين"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="rounded p-0.5 text-white hover:bg-red-500/80"
                  onClick={() => remove(i)}
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
        {values.length < max && !disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={cn(
              "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-cream-400 bg-cream-50 text-ink-muted transition hover:border-henna-300 hover:bg-henna-50/40",
              busy && "opacity-60"
            )}
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[10px] font-semibold">
              {busy ? "جاري..." : "رفع"}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-[10px] text-ink-light">
        يُضغط الصور تلقائيًا · الفيديو القصير فقط (وهمي محلي)
      </p>
    </div>
  );
}
