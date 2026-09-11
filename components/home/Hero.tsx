"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
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
    }, 7000);
    return () => clearInterval(t);
  }, [slides.length, reduceMotion]);

  const slide = slides[index];

  return (
    <section className="container-pad pt-4 sm:pt-7">
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-soft sm:rounded-[2.5rem]">
        <div className="relative aspect-[4/5] min-h-[21rem] sm:aspect-[16/9] sm:min-h-0 lg:aspect-[21/9]">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
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
              {/* Editorial wash — softer, warmer than pure black */}
              <div className="absolute inset-0 bg-gradient-to-t from-henna-900/85 via-henna-800/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-henna-900/20" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-11 lg:p-16">
            <div key={slide.id} className="max-w-xl motion-safe:animate-fadeIn">
              <p className="mb-3 hidden text-[11px] font-medium tracking-luxury-wide text-gold-300 sm:mb-4 sm:block">
                نقشات · أناقة · مناسبات
              </p>
              <h1 className="font-display text-[1.75rem] font-semibold leading-[1.25] tracking-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-white/80 sm:mt-4 sm:line-clamp-none sm:text-base">
                {slide.subtitle}
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
                <Link
                  href={slide.ctaPrimary.href}
                  className="btn-primary min-h-12 w-full gap-2 bg-cream-50 text-henna hover:bg-white sm:w-auto"
                >
                  {slide.ctaPrimary.label}
                  <ArrowUpLeft className="h-4 w-4 opacity-70" strokeWidth={1.75} />
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

            <div className="mt-6 flex items-center justify-between sm:mt-8">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`الشريحة ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 min-w-[0.5rem] rounded-full transition-all duration-300",
                      i === index ? "w-8 bg-gold-400" : "w-2 bg-white/40 hover:bg-white/60"
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label="التالي"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
