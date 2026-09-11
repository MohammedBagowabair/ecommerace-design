"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { useOrdersStore } from "@/lib/store/orders";
import { AccountShell } from "@/components/account/AccountNav";
import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function OrdersListPage() {
  const orders = useOrdersStore((s) => s.orders);
  const ensureSeeds = useOrdersStore((s) => s.ensureSeeds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    ensureSeeds();
  }, [ensureSeeds]);

  if (!mounted) {
    return <PageSkeleton />;
  }

  return (
    <AccountShell
      title="طلباتي"
      subtitle={
        orders.length
          ? `${orders.length} طلب — الرقم، التاريخ، المنتجات، الإجمالي، حالة الدفع وحالة الطلب`
          : "ستظهر هنا طلباتك بعد إتمام الشراء"
      }
    >
      {!orders.length ? (
        <EmptyState
          icon="orders"
          title="لا توجد طلبات بعد"
          description="تصفّحي النقشات وأتممي طلبك عبر التحويل البنكي، وستظهر تفاصيله هنا مع خط زمني للمتابعة."
          actionLabel="تسوّقي الآن"
          actionHref="/products"
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <OrderCard order={o} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-3xl bg-henna-50/60 p-4 text-sm text-henna-700">
        <Package className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          طلبات العرض التجريبية مدمجة تلقائيًا مع أي طلبات تنشئينها من{" "}
          <Link href="/checkout" className="font-bold underline">
            إتمام الطلب
          </Link>
          . تُحفظ في المتصفح تحت المفتاح{" "}
          <span dir="ltr" className="font-mono text-xs">
            naqshat-orders
          </span>
          .
        </p>
      </div>
    </AccountShell>
  );
}
