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
    <section className="container-pad py-6 sm:py-9">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div>
          <p className="section-eyebrow hidden sm:block">للمناسبات</p>
          <h2 className="section-title mt-0 sm:mt-1">نقشات تليق بلحظتكِ</h2>
        </div>
        <Link
          href="/categories/al-munasabat"
          className="min-h-10 inline-flex items-center text-xs font-medium text-henna transition hover:text-henna-700 sm:text-sm"
        >
          المزيد
        </Link>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {occasions.map((o) => {
          const Icon = o.icon;
          return (
            <Link
              key={o.label}
              href={o.href}
              className="group flex min-w-[6.75rem] flex-col items-center gap-2.5 rounded-2xl bg-[#FFFCFA] p-3.5 shadow-gallery transition sm:min-w-0 sm:gap-3 sm:rounded-3xl sm:p-5 sm:hover:shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100 text-henna transition group-hover:bg-henna group-hover:text-cream-50 sm:h-12 sm:w-12">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="text-center text-xs font-medium text-ink sm:text-sm">
                {o.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
