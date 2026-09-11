import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

export function ProductGrid({
  products,
  emptyTitle = "لا توجد منتجات",
  emptyDescription = "جرّبي تغيير الفلاتر أو تصفّحي جميع النقشات.",
  emptyIcon = "products",
}: {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: "products" | "search" | "cart" | "wishlist" | "empty";
}) {
  if (!products.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={emptyIcon}
        secondaryHref="/"
        secondaryLabel="الرئيسية"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
