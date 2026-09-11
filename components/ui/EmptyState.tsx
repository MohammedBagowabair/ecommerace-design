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
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-[#FFFCFA] px-6 py-18 text-center shadow-gallery sm:py-22">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-henna">
        <Icon className="h-7 w-7" strokeWidth={1.25} />
      </div>
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {description && (
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
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
