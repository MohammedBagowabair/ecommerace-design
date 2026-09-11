import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";

export const metadata: Metadata = {
  title: "النقشات",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <div className="container-pad py-6 sm:py-8">
      <ProductsBrowser
        title="جميع النقشات"
        initialCategorySlug={searchParams.category}
      />
    </div>
  );
}
