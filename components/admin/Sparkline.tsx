import { cn } from "@/lib/utils";

/** Lightweight CSS sparkline from numeric series (no chart lib) */
export function Sparkline({
  values,
  className,
  strokeClassName = "stroke-henna",
  fillClassName = "fill-henna/15",
}: {
  values: number[];
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
}) {
  const w = 120;
  const h = 36;
  const pad = 2;
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L${pts[0][0].toFixed(1)} ${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("h-9 w-full max-w-[140px]", className)}
      aria-hidden
    >
      <path d={area} className={fillClassName} />
      <path d={line} fill="none" strokeWidth="1.75" className={strokeClassName} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Simple CSS bar sparkline */
export function BarSpark({
  values,
  className,
  barClassName = "bg-henna/70",
}: {
  values: number[];
  className?: string;
  barClassName?: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={cn("flex h-9 items-end gap-0.5", className)} aria-hidden>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn("min-w-[3px] flex-1 rounded-t-sm", barClassName)}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
