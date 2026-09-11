"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, UserRound } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { OrderStatusBadge } from "@/components/account/StatusBadge";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOrders } from "@/lib/admin/use-admin-orders";
import { deriveCustomers } from "@/lib/admin/merged-catalog";
import { formatOrderDate, orderItemCount } from "@/lib/order-status";
import { formatPriceShort } from "@/lib/utils";

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? decodeURIComponent(params.id) : "";
  const canView = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("customers.view")
  );
  const { orders } = useAdminOrders();

  const customer = useMemo(() => {
    return deriveCustomers(orders).find((c) => c.id === id);
  }, [orders, id]);

  if (!canView) {
    return (
      <AdminShell title="تفاصيل العميلة">
        <PermissionDenied message="ليس لديك صلاحية عرض العملاء." />
      </AdminShell>
    );
  }

  if (!customer) {
    return (
      <AdminShell title="تفاصيل العميلة">
        <div className="rounded-2xl border border-cream-200 bg-white p-10 text-center shadow-card">
          <UserRound className="mx-auto h-10 w-10 text-ink-light" />
          <p className="mt-3 font-bold text-ink">العميلة غير موجودة</p>
          <Link href="/admin/customers" className="btn-primary mt-5 inline-flex">
            العودة للعملاء
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={customer.name}>
      <div className="mb-4">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1 text-sm font-semibold text-henna hover:underline"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للعملاء
        </Link>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-card">
          <p className="text-xs text-ink-muted">الجوال</p>
          <p className="mt-1 font-bold text-ink" dir="ltr">
            {customer.phone}
          </p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-card">
          <p className="text-xs text-ink-muted">عدد الطلبات</p>
          <p className="mt-1 font-bold text-ink">{customer.orderCount}</p>
        </div>
        <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-card">
          <p className="text-xs text-ink-muted">إجمالي الإنفاق</p>
          <p className="mt-1 font-bold text-ink">
            {formatPriceShort(customer.totalSpent)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        <div className="border-b border-cream-200 px-4 py-3">
          <h2 className="text-sm font-bold text-ink">طلبات العميلة</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[640px]">
            <thead>
              <tr className="text-start">
                <th className="px-4 py-2.5 font-semibold">رقم الطلب</th>
                <th className="px-4 py-2.5 font-semibold">الحالة</th>
                <th className="px-4 py-2.5 font-semibold">العناصر</th>
                <th className="px-4 py-2.5 font-semibold">الإجمالي</th>
                <th className="px-4 py-2.5 font-semibold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((o) => (
                <tr key={o.id} className="border-b border-cream-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(o.id)}`}
                      className="font-semibold text-henna hover:underline"
                    >
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {orderItemCount(o.items)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatPriceShort(o.total)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {formatOrderDate(o.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
