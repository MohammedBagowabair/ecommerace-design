import type { Metadata } from "next";
import { ProductsBrowser } from "@/components/product/ProductsBrowser";

export const metadata: Metadata = {
  title: "الجديد",
};

export default function NewPage() {
  return (
    <div className="container-pad py-6 sm:py-8">
      <ProductsBrowser onlyNew title="أحدث النقشات" />
    </div>
  );
}
