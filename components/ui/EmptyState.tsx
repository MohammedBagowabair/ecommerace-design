import Link from "next/link";
import {
  PackageOpen,
  SearchX,
  Heart,
  ShoppingBag,
  MapPin,
  Package,
  Star,
  Eye,
  Inbox,
} from "lucide-react";

const icons = {
  search: SearchX,
  cart: ShoppingBag,
  wishlist: Heart,
  products: PackageOpen,
  address: MapPin,
  orders: Package,
  reviews: Star,
  recent: Eye,
  empty: Inbox,
};

export function EmptyState({
  title,
  description,
  actionHref = "/products",
  actionLabel = "تصفحي النقشات",
  icon = "products",
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: keyof typeof icons;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  const Icon = icons[icon];
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-cream-200/60 bg-white px-6 py-16 text-center shadow-card sm:py-20">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cream-100 to-blush/60 text-henna shadow-sm ring-1 ring-cream-200/80">
        <Icon className="h-8 w-8" strokeWidth={1.4} />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      {description && (
        <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link href={actionHref} className="btn-primary min-w-[10rem]">
          {actionLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref} className="btn-outline">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
