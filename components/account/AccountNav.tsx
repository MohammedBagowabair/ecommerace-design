"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Heart,
  MapPin,
  Package,
  Star,
  User,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const accountLinks: {
  href: string;
  label: string;
  icon: typeof User;
  exact?: boolean;
}[] = [
  { href: "/account", label: "حسابي", icon: UserCircle2, exact: true },
  { href: "/account/profile", label: "معلوماتي", icon: User },
  { href: "/account/addresses", label: "عناويني", icon: MapPin },
  { href: "/account/orders", label: "طلباتي", icon: Package },
  { href: "/wishlist", label: "مفضلتي", icon: Heart },
  { href: "/account/reviews", label: "تقييماتي", icon: Star },
];

export function AccountNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-2 overflow-x-auto hide-scrollbar pb-1 sm:flex-col sm:overflow-visible sm:pb-0",
        className
      )}
      aria-label="قائمة الحساب"
    >
      {accountLinks.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname === l.href || pathname.startsWith(`${l.href}/`);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:w-full sm:rounded-2xl",
              active
                ? "bg-henna text-white shadow-card"
                : "bg-white text-ink-muted shadow-card hover:bg-cream-100 hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AccountShell({
  title,
  subtitle,
  children,
  backHref = "/account",
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  showBack?: boolean;
}) {
  return (
    <div className="container-pad overflow-x-clip py-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-start lg:gap-8">
        <aside className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0">
          <AccountNav />
        </aside>
        <div className="min-w-0 flex-1">
          <div className="mb-5">
            {showBack && (
              <Link
                href={backHref}
                className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-henna hover:underline"
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
                العودة
              </Link>
            )}
            <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
