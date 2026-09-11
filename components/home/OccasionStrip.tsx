import Link from "next/link";
import { Heart, PartyPopper, Sparkles, Crown, Flower2, MoonStar } from "lucide-react";

const occasions = [
  {
    label: "عروس",
    href: "/categories/al-arous",
    icon: Crown,
    tone: "from-henna-600 to-henna-800",
  },
  {
    label: "زفاف",
    href: "/categories/al-munasabat",
    icon: Heart,
    tone: "from-gold-500 to-gold-600",
  },
  {
    label: "خطوبة",
    href: "/search?q=خطوبة",
    icon: Sparkles,
    tone: "from-henna-500 to-gold-500",
  },
  {
    label: "عيد",
    href: "/search?q=عيد",
    icon: MoonStar,
    tone: "from-ink to-henna-700",
  },
  {
    label: "حفلة",
    href: "/search?q=حفلة",
    icon: PartyPopper,
    tone: "from-gold-600 to-henna-600",
  },
  {
    label: "يومية ناعمة",
    href: "/categories/naima",
    icon: Flower2,
    tone: "from-henna-400 to-henna-600",
  },
];

export function OccasionStrip() {
  return (
    <section className="container-pad py-5 sm:py-8">
      <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
        <div>
          <p className="section-eyebrow hidden sm:block">للمناسبات</p>
          <h2 className="section-title mt-0 sm:mt-1">نقشات تليق بلحظتكِ</h2>
        </div>
        <Link
          href="/categories/al-munasabat"
          className="min-h-10 inline-flex items-center text-xs font-semibold text-henna hover:text-henna-600 sm:text-sm"
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
              className="group flex min-w-[6.75rem] flex-col items-center gap-2.5 rounded-2xl bg-white p-3 shadow-card transition sm:min-w-0 sm:gap-3 sm:rounded-3xl sm:p-4 sm:hover:-translate-y-0.5 sm:hover:shadow-soft"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${o.tone} text-white shadow-sm transition motion-safe:group-hover:scale-105 sm:h-14 sm:w-14`}
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <span className="text-center text-xs font-bold text-ink sm:text-sm">
                {o.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
