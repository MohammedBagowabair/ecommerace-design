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
    <section className="container-pad py-6 sm:py-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-600">للمناسبات</p>
          <h2 className="section-title mt-1">نقشات تليق بلحظتكِ</h2>
        </div>
        <Link href="/categories/al-munasabat" className="text-sm font-semibold text-henna hover:text-henna-600">
          استكشفي المزيد
        </Link>
      </div>
      <div className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6">
        {occasions.map((o) => {
          const Icon = o.icon;
          return (
            <Link
              key={o.label}
              href={o.href}
              className="group flex min-w-[7.5rem] flex-col items-center gap-3 rounded-3xl bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft sm:min-w-0"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${o.tone} text-white shadow-sm transition group-hover:scale-105`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold text-ink">{o.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
