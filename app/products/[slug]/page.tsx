import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/data/products";
import { getReviewsForProduct } from "@/lib/data/reviews";
import { getPdpRecommendations } from "@/lib/recommendations";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const reviews = getReviewsForProduct(product.id);
  const { similar, related, alsoNeed } = getPdpRecommendations(product);

  return (
    <ProductDetail
      product={product}
      reviews={reviews}
      similar={similar}
      related={related}
      alsoNeed={alsoNeed}
    />
  );
}
