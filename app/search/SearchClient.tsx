"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { pushRecentSearch } from "@/lib/search";

export function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();
  const openSearch = useUIStore((s) => s.openSearchOverlay);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  return (
    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <form
        className="relative max-w-xl flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const query = q.trim();
          if (query) pushRecentSearch(query);
          router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
        }}
      >
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحثي عن نقشات أو منتجات..."
          className="input-pill ps-11"
        />
      </form>
      <button
        type="button"
        onClick={openSearch}
        className="btn-outline shrink-0 text-xs sm:text-sm"
      >
        <Sparkles className="h-4 w-4" />
        بحث سريع بالاقتراحات
      </button>
    </div>
  );
}
