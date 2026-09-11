import {
  getOrderStatusLabel,
  getOrderStatusTone,
  getPaymentStatusLabel,
  getPaymentStatusTone,
} from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const tone = getOrderStatusTone(status);
  return (
    <span
      className={cn(
        "badge-pill ring-1",
        tone.bg,
        tone.text,
        tone.ring,
        className
      )}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const tone = getPaymentStatusTone(status);
  return (
    <span className={cn("badge-pill", tone.bg, tone.text, className)}>
      {getPaymentStatusLabel(status)}
    </span>
  );
}
