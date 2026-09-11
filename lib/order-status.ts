import type { OrderStatus, PaymentStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "بانتظار الدفع",
  payment_review: "جاري مراجعة الدفع",
  payment_confirmed: "تم تأكيد الدفع",
  preparing: "جاري التجهيز",
  ready_for_delivery: "جاهز للتوصيل",
  out_for_delivery: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "تم الإلغاء",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "بانتظار الدفع",
  reviewing: "جاري مراجعة الدفع",
  confirmed: "تم تأكيد الدفع",
  cancelled: "ملغي",
};

/** Timeline steps (excludes cancelled — shown separately) */
export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  "pending_payment",
  "payment_review",
  "payment_confirmed",
  "preparing",
  "ready_for_delivery",
  "out_for_delivery",
  "delivered",
];

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function derivePaymentStatus(status: OrderStatus): PaymentStatus {
  if (status === "pending_payment") return "pending";
  if (status === "payment_review") return "reviewing";
  if (status === "cancelled") return "cancelled";
  return "confirmed";
}

export function getPaymentStatusLabel(status: OrderStatus): string {
  return PAYMENT_STATUS_LABELS[derivePaymentStatus(status)];
}

export function getOrderStatusTone(status: OrderStatus): {
  bg: string;
  text: string;
  ring: string;
} {
  switch (status) {
    case "pending_payment":
      return { bg: "bg-amber-50", text: "text-amber-800", ring: "ring-amber-200" };
    case "payment_review":
      return { bg: "bg-orange-50", text: "text-orange-800", ring: "ring-orange-200" };
    case "payment_confirmed":
      return { bg: "bg-sky-50", text: "text-sky-800", ring: "ring-sky-200" };
    case "preparing":
      return { bg: "bg-indigo-50", text: "text-indigo-800", ring: "ring-indigo-200" };
    case "ready_for_delivery":
      return { bg: "bg-violet-50", text: "text-violet-800", ring: "ring-violet-200" };
    case "out_for_delivery":
      return { bg: "bg-blue-50", text: "text-blue-800", ring: "ring-blue-200" };
    case "delivered":
      return { bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-200" };
    case "cancelled":
      return { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
    default:
      return { bg: "bg-cream-100", text: "text-ink-muted", ring: "ring-cream-200" };
  }
}

export function getPaymentStatusTone(status: OrderStatus): {
  bg: string;
  text: string;
} {
  const p = derivePaymentStatus(status);
  if (p === "pending") return { bg: "bg-amber-50", text: "text-amber-800" };
  if (p === "reviewing") return { bg: "bg-orange-50", text: "text-orange-800" };
  if (p === "cancelled") return { bg: "bg-red-50", text: "text-red-700" };
  return { bg: "bg-emerald-50", text: "text-emerald-800" };
}

/** Index in timeline; -1 if cancelled */
export function getTimelineIndex(status: OrderStatus): number {
  if (status === "cancelled") return -1;
  return ORDER_TIMELINE_STEPS.indexOf(status);
}

export function formatOrderDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-YE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatOrderDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ar-YE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function orderItemCount(items: { quantity: number }[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}
