"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Search,
  Sparkles,
  Tag,
  Layers,
  CalendarHeart,
  X,
} from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import {
  clearRecentSearches,
  getRecentSearches,
  getSearchSuggestions,
  popularSearches,
  pushRecentSearch,
  suggestionKindLabel,
  type SearchSuggestion,
  type SearchSuggestionKind,
} from "@/lib/search";
import { cn } from "@/lib/utils";

const kindIcon: Record<SearchSuggestionKind, typeof Search> = {
  product: Sparkles,
  category: Layers,
  pattern: Tag,
  occasion: CalendarHeart,
};

export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOverlayOpen);
  const close = useUIStore((s) => s.closeSearchOverlay);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => getSearchSuggestions(q), [q]);

  const flatActions = useMemo(() => {
    const items: { type: "suggestion" | "query"; suggestion?: SearchSuggestion; query?: string }[] = [];
    if (q.trim()) {
      items.push({ type: "query", query: q.trim() });
    }
    suggestions.forEach((s) => items.push({ type: "suggestion", suggestion: s }));
    return items;
  }, [q, suggestions]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActiveIndex(-1);
    setRecent(getRecentSearches());
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [q]);

  const goSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      pushRecentSearch(trimmed);
      setRecent(getRecentSearches());
      close();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [close, router]
  );

  const goSuggestion = useCallback(
    (s: SearchSuggestion) => {
      pushRecentSearch(s.label);
      setRecent(getRecentSearches());
      close();
      router.push(s.href);
    },
    [close, router]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatActions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatActions[activeIndex]) {
        const item = flatActions[activeIndex];
        if (item.type === "query" && item.query) goSearch(item.query);
        else if (item.suggestion) goSuggestion(item.suggestion);
      } else if (q.trim()) {
        goSearch(q);
      }
    }
  };

  if (!open) return null;

  const grouped = suggestions.reduce<Record<string, SearchSuggestion[]>>(
    (acc, s) => {
      (acc[s.kind] ||= []).push(s);
      return acc;
    },
    {}
  );

  let runningIndex = q.trim() ? 0 : -1;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="البحث">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        aria-label="إغلاق البحث"
        onClick={close}
      />
      <div className="relative mx-auto mt-[8vh] w-[min(100%,40rem)] px-4 animate-fadeIn">
        <div className="overflow-hidden rounded-3xl bg-white shadow-float">
          <div className="flex items-center gap-2 border-b border-cream-200 px-3 py-3 sm:px-4">
            <Search className="h-5 w-5 shrink-0 text-ink-light" />
            <input
              ref={inputRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="ابحثي عن نقشة، قسم، نوع، أو مناسبة..."
              className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-light"
              autoComplete="off"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="flex h-11 w-11 items-center justify-center rounded-full text-ink-light hover:bg-cream-100 hover:text-ink"
                aria-label="مسح"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-cream-100"
              aria-label="إغلاق"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[min(70vh,28rem)] overflow-y-auto p-2 sm:p-3">
            {q.trim() ? (
              <>
                <button
                  type="button"
                  onClick={() => goSearch(q)}
                  className={cn(
                    "mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-start text-sm transition",
                    activeIndex === 0
                      ? "bg-henna-50 text-henna"
                      : "hover:bg-cream-50"
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cream-100 text-ink-muted">
                    <Search className="h-4 w-4" />
                  </span>
                  <span>
                    عرض كل النتائج لـ «
                    <strong className="font-bold text-ink">{q.trim()}</strong>»
                  </span>
                </button>

                {suggestions.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-ink-muted">
                    لا اقتراحات — اضغطي Enter للبحث
                  </p>
                ) : (
                  (Object.keys(grouped) as SearchSuggestionKind[]).map((kind) => {
                    const list = grouped[kind];
                    if (!list?.length) return null;
                    const Icon = kindIcon[kind];
                    return (
                      <div key={kind} className="mb-3">
                        <p className="mb-1 px-3 text-[11px] font-bold uppercase tracking-wide text-ink-light">
                          {suggestionKindLabel[kind]}
                        </p>
                        <ul className="space-y-0.5">
                          {list.map((s) => {
                            runningIndex += 1;
                            const idx = runningIndex;
                            return (
                              <li key={s.id}>
                                <button
                                  type="button"
                                  onClick={() => goSuggestion(s)}
                                  onMouseEnter={() => setActiveIndex(idx)}
                                  className={cn(
                                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-start transition",
                                    activeIndex === idx
                                      ? "bg-henna-50"
                                      : "hover:bg-cream-50"
                                  )}
                                >
                                  {s.image ? (
                                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                                      <Image
                                        src={s.image}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    </span>
                                  ) : (
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-100 text-ink-muted">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-semibold text-ink">
                                      {s.label}
                                    </span>
                                    {s.meta && (
                                      <span className="block truncate text-xs text-ink-light">
                                        {s.meta}
                                      </span>
                                    )}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                )}
              </>
            ) : (
              <>
                {recent.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-1 flex items-center justify-between px-3">
                      <p className="text-[11px] font-bold text-ink-light">
                        عمليات بحث سابقة
                      </p>
                      <button
                        type="button"
                        className="text-[11px] font-semibold text-henna"
                        onClick={() => {
                          clearRecentSearches();
                          setRecent([]);
                        }}
                      >
                        مسح
                      </button>
                    </div>
                    <ul className="space-y-0.5">
                      {recent.map((r) => (
                        <li key={r}>
                          <button
                            type="button"
                            onClick={() => goSearch(r)}
                            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-start text-sm hover:bg-cream-50"
                          >
                            <Clock className="h-4 w-4 text-ink-light" />
                            <span className="font-medium text-ink">{r}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="mb-2.5 px-3 text-[11px] font-bold text-ink-light">
                    اقتراحات شائعة — اضغطي للبحث السريع
                  </p>
                  <div className="flex flex-wrap gap-2 px-2">
                    {popularSearches.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => goSearch(p)}
                        className="chip-idle"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="mt-4 px-3 pb-2 text-center text-[11px] text-ink-light">
                  ابدئي بالكتابة للاقتراحات · Esc للإغلاق
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
