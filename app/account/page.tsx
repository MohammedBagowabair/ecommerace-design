"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Heart,
  MapPin,
  Package,
  Star,
  User,
} from "lucide-react";
import { useCustomerStore } from "@/lib/store/customer";
import { useOrdersStore } from "@/lib/store/orders";
import { useWishlistStore } from "@/lib/store/wishlist";
import { AccountShell } from "@/components/account/AccountNav";
import { OrderCard } from "@/components/account/OrderCard";
import { PageSkeleton } from "@/components/ui/Skeleton";

const hubCards = [
  {
    href: "/account/profile",
    label: "معلوماتي",
    desc: "الاسم والجوال والبريد",
    icon: User,
  },
  {
    href: "/account/addresses",
    label: "عناويني",
    desc: "عناوين التوصيل المحفوظة",
    icon: MapPin,
  },
  {
    href: "/account/orders",
    label: "طلباتي",
    desc: "تتبع ومتابعة الطلبات",
    icon: Package,
  },
  {
    href: "/wishlist",
    label: "مفضلتي",
    desc: "النقشات المحفوظة",
    icon: Heart,
  },
  {
    href: "/account/reviews",
    label: "تقييماتي",
    desc: "تقييماتكِ للمنتجات",
    icon: Star,
  },
] as const;

export default function AccountHubPage() {
  const profile = useCustomerStore((s) => s.profile);
  const addresses = useCustomerStore((s) => s.addresses);
  const orders = useOrdersStore((s) => s.orders);
  const ensureSeeds = useOrdersStore((s) => s.ensureSeeds);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    ensureSeeds();
  }, [ensureSeeds]);

  if (!mounted) {
    return <PageSkeleton />;
  }

  const recent = orders.slice(0, 3);

  return (
    <AccountShell
      title="حسابي"
      subtitle={`مرحبًا ${profile.name || "عزيزتي"} 🌸`}
      showBack={false}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {hubCards.map((c) => {
          const Icon = c.icon;
          let meta: string = c.desc;
          if (c.href === "/account/addresses") {
            meta = `${addresses.length} عنوان محفوظ`;
          } else if (c.href === "/account/orders") {
            meta = `${orders.length} طلب`;
          } else if (c.href === "/wishlist") {
            meta = wishCount ? `${wishCount} نقشة محفوظة` : c.desc;
          }
          return (
            <Link
              key={c.href}
              href={c.href}
              className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:shadow-soft"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-henna-50 text-henna">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-ink">{c.label}</span>
                <span className="block text-xs text-ink-muted">{meta}</span>
              </span>
              <ChevronLeft className="h-5 w-5 rotate-180 text-ink-light" />
            </Link>
          );
        })}
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-ink">أحدث الطلبات</h2>
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-henna hover:underline"
          >
            عرض الكل
          </Link>
        </div>
        {!recent.length ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-card">
            <p className="text-sm text-ink-muted">لا توجد طلبات بعد</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex">
              تسوّقي الآن
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((o) => (
              <li key={o.id}>
                <OrderCard order={o} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AccountShell>
  );
}
