import type { OrderStatus, PaymentStatus } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "بانتظار الدفع",
  payment_review: "جاري مراجعة",
  payment_confirmed: "تم الدفع",
  preparing: "جاري التجهيز",
  delivered: "تم التسليم",
  cancelled: "تم الإلغاء",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "بانتظار الدفع",
  reviewing: "جاري مراجعة",
  confirmed: "تم الدفع",
  cancelled: "ملغي",
};

/** Timeline steps (excludes cancelled — shown separately) */
export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  "pending_payment",
  "payment_review",
  "payment_confirmed",
  "preparing",
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

/** Migrate legacy 7-step statuses (and older aliases) to the simplified set */
export function normalizeOrderStatus(status: string): OrderStatus {
  if (status === "awaiting_receipt") return "payment_review";
  if (status === "confirmed") return "payment_confirmed";
  if (status === "ready_for_delivery" || status === "out_for_delivery") {
    return "preparing";
  }
  const allowed: OrderStatus[] = [
    "pending_payment",
    "payment_review",
    "payment_confirmed",
    "preparing",
    "delivered",
    "cancelled",
  ];
  if ((allowed as string[]).includes(status)) return status as OrderStatus;
  return "payment_review";
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
