"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => clearInterval(t);
  }, [slides.length, reduceMotion]);

  const slide = slides[index];

  return (
    <section className="container-pad pt-3 sm:pt-6">
      <div className="relative overflow-hidden rounded-[1.5rem] shadow-soft sm:rounded-[2.25rem]">
        <div className="relative aspect-[4/5] min-h-[20rem] sm:aspect-[16/9] sm:min-h-0 lg:aspect-[21/9]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none",
                i === index ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={i !== index}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={i === 0}
                sizes="(max-width:640px) 100vw, (max-width:1024px) 100vw, 1280px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-henna/10" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 lg:p-16">
            <div key={slide.id} className="max-w-xl motion-safe:animate-fadeIn">
              <p className="mb-2 hidden rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold text-gold-200 backdrop-blur-md sm:mb-3 sm:inline-flex">
                نقشات · نساء · مناسبات
              </p>
              <h1 className="text-[1.65rem] font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/90 sm:mt-3 sm:line-clamp-none sm:text-base">
                {slide.subtitle}
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href={slide.ctaPrimary.href}
                  className="btn-primary min-h-12 w-full bg-white text-ink hover:bg-cream-100 sm:w-auto"
                >
                  {slide.ctaPrimary.label}
                </Link>
                {slide.ctaSecondary && (
                  <Link
                    href={slide.ctaSecondary.href}
                    className="btn-secondary hidden min-h-12 sm:inline-flex"
                  >
                    {slide.ctaSecondary.label}
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between sm:mt-6">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`الشريحة ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-2.5 min-w-[0.625rem] rounded-full transition-all",
                      i === index ? "w-7 bg-white" : "w-2.5 bg-white/50"
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
