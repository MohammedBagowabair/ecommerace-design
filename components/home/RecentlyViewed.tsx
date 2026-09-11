"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import { recommendRecentlyViewed } from "@/lib/recommendations";
import { ProductSection } from "@/components/product/ProductSection";

export function RecentlyViewed({
  excludeId,
  title = "شاهدتِ مؤخرًا",
  limit = 8,
}: {
  excludeId?: string;
  title?: string;
  limit?: number;
} = {}) {
  const ids = useRecentlyViewedStore((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !ids.length) return null;

  const products = recommendRecentlyViewed(ids, excludeId, limit);
  if (!products.length) return null;

  return (
    <ProductSection
      title={title}
      subtitle="بناءً على تصفحكِ الأخير"
      products={products}
      href="/recently-viewed"
    />
  );
}
