import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product, StockStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("ar-YE")} ريال يمني`;
}

export function formatPriceShort(amount: number): string {
  return `${amount.toLocaleString("ar-YE")} ر.ي`;
}

/** Convert YER amount to SAR using yer-per-1-SAR rate */
export function yerToSar(yerAmount: number, yerPerSar?: number | null): number | null {
  if (!yerPerSar || yerPerSar <= 0) return null;
  return yerAmount / yerPerSar;
}

export function formatSarFromYer(yerAmount: number, yerPerSar?: number | null): string | null {
  const sar = yerToSar(yerAmount, yerPerSar);
  if (sar == null) return null;
  return `${sar.toLocaleString("ar-SA", { maximumFractionDigits: 2 })} ر.س`;
}

export function formatYerPerSarRate(yerPerSar?: number | null): string {
  if (!yerPerSar || yerPerSar <= 0) return "غير مضبوط";
  return `1 ر.س = ${yerPerSar.toLocaleString("ar-YE")} ر.ي`;
}

/** Offer end timestamp for display. Safe to call from server components. */
export function formatOfferEndDate(endsAt: string): string {
  try {
    return new Intl.DateTimeFormat("ar-YE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
    }).format(new Date(endsAt));
  } catch {
    return endsAt;
  }
}

export function getDiscountPercent(price: number, compareAt?: number): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function getStockLabel(status: StockStatus, stock: number): string {
  if (status === "out_of_stock" || stock <= 0) return "نفدت الكمية";
  if (status === "low_stock" || stock <= 5) return `متبقي ${stock} فقط`;
  return "متوفر";
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 5) return "low_stock";
  return "in_stock";
}

export function productMatchesQuery(product: Product, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const hay = [
    product.name,
    product.shortName ?? "",
    product.description,
    product.sku,
    ...product.tags,
    product.patternType ?? "",
    product.occasion ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(query) || query.split(/\s+/).every((w) => hay.includes(w));
}

export function buildWhatsAppReceiptLink(phone: string, orderId: string, totalLabel: string): string {
  const message = [
    "السلام عليكم،",
    `أرسل إيصال التحويل لطلب رقم ${orderId}.`,
    `المبلغ: ${totalLabel}`,
    "شكرًا لكم 🌸",
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
