"use client";

import { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

const LEN = 6;

export function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: LEN }, (_, i) => value[i] ?? "");

  function setAt(index: number, char: string) {
    const next = digits.map((d, i) => (i === index ? char : d));
    onChange(next.join("").slice(0, LEN));
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setAt(index, "");
      return;
    }
    if (cleaned.length > 1) {
      // paste into this cell
      const merged = (value.slice(0, index) + cleaned)
        .replace(/\D/g, "")
        .slice(0, LEN);
      onChange(merged);
      const focusIdx = Math.min(merged.length, LEN - 1);
      refs.current[focusIdx]?.focus();
      return;
    }
    setAt(index, cleaned);
    if (index < LEN - 1) refs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setAt(index - 1, "");
    }
    if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < LEN - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!text) return;
    onChange(text);
    refs.current[Math.min(text.length, LEN - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2 dir-ltr" dir="ltr">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={6}
          disabled={disabled}
          aria-label={`رقم التحقق ${i + 1}`}
          className={cn(
            "h-12 w-11 rounded-2xl border border-cream-300 bg-cream-50 text-center text-lg font-bold text-ink outline-none transition",
            "focus:border-henna-300 focus:bg-white focus:ring-2 focus:ring-henna-100",
            "disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl"
          )}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
