import Link from "next/link";
import { Heart, PartyPopper, Sparkles, Crown, Flower2, MoonStar } from "lucide-react";

const occasions = [
  {
    label: "عروس",
    href: "/categories/al-arous",
    icon: Crown,
  },
  {
    label: "زفاف",
    href: "/categories/al-munasabat",
    icon: Heart,
  },
  {
    label: "خطوبة",
    href: "/search?q=خطوبة",
    icon: Sparkles,
  },
  {
    label: "عيد",
    href: "/search?q=عيد",
    icon: MoonStar,
  },
  {
    label: "حفلة",
    href: "/search?q=حفلة",
    icon: PartyPopper,
  },
  {
    label: "يومية ناعمة",
    href: "/categories/naima",
    icon: Flower2,
  },
];

export function OccasionStrip() {
  return (
    <section className="container-pad py-5 sm:py-8">
      <div className="mb-3.5 flex items-end justify-between gap-3 sm:mb-5">
        <div>
          <p className="section-eyebrow hidden sm:block">للمناسبات</p>
          <h2 className="section-title mt-0 sm:mt-1">نقشات تليق بلحظتكِ</h2>
        </div>
        <Link
          href="/categories/al-munasabat"
          className="min-h-9 inline-flex items-center text-xs font-semibold text-ink transition hover:text-rose-600 sm:text-sm"
        >
          المزيد
        </Link>
      </div>
      <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {occasions.map((o) => {
          const Icon = o.icon;
          return (
            <Link
              key={o.label}
              href={o.href}
              className="group flex min-w-[6.25rem] flex-col items-center gap-2 rounded-lg border border-cream-200 bg-white p-3 transition hover:border-ink sm:min-w-0 sm:gap-2.5 sm:p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cream-100 text-ink transition group-hover:bg-ink group-hover:text-white sm:h-11 sm:w-11">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="text-center text-xs font-semibold text-ink sm:text-sm">
                {o.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
