"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="container-pad pt-4 sm:pt-6">
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-soft sm:rounded-[2.25rem]">
        <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-henna/10" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-16">
            <div key={slide.id} className="max-w-xl animate-fadeIn">
              <p className="mb-3 inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold text-gold-200 backdrop-blur-md">
                نقشات · نساء · مناسبات
              </p>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/90 sm:text-base">
                {slide.subtitle}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={slide.ctaPrimary.href}
                  className="btn-primary bg-white text-ink hover:bg-cream-100"
                >
                  {slide.ctaPrimary.label}
                </Link>
                {slide.ctaSecondary && (
                  <Link href={slide.ctaSecondary.href} className="btn-secondary">
                    {slide.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`الشريحة ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i === index ? "w-8 bg-white" : "w-2 bg-white/50"
                    )}
                  />
                ))}
              </div>
              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  aria-label="السابق"
                  onClick={() =>
                    setIndex((i) => (i - 1 + slides.length) % slides.length)
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="التالي"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
