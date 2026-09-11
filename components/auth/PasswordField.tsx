"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export function PasswordField({
  label,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  required,
  name,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  name?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div className="relative">
        <Lock
          className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
          strokeWidth={1.75}
        />
        <input
          type={show ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          className="input-field min-h-[3rem] rounded-2xl pe-12 ps-10 text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          onClick={() => setShow((v) => !v)}
          className="absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-cream-100 hover:text-ink"
        >
          {show ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.75} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </label>
  );
}
