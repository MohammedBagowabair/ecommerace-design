"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  UsersRound,
  Wallet,
  ArrowLeft,
  AlertTriangle,
  Clock,
  Tag,
  FolderTree,
  Settings,
  ScrollText,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Sparkline, BarSpark } from "@/components/admin/Sparkline";
import { AdminKpiSkeleton } from "@/components/admin/AdminTableSkeleton";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useOrdersStore } from "@/lib/store/orders";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import {
  combineOrders,
  deriveCustomers,
  mergeProducts,
} from "@/lib/admin/merged-catalog";
import { formatPriceShort, cn } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/account/StatusBadge";
import { hasAnyPermission } from "@/lib/admin/permissions";

function lastNDaysRevenue(orders: { createdAt: string; total: number; status: string }[], days: number) {
  const now = new Date();
  const buckets: number[] = Array.from({ length: days }, () => 0);
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const d = new Date(o.createdAt);
    const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) {
      buckets[days - 1 - diff] += o.total;
    }
  }
  return buckets;
}

function lastNDaysOrderCounts(orders: { createdAt: string }[], days: number) {
  const now = new Date();
  const buckets: number[] = Array.from({ length: days }, () => 0);
  for (const o of orders) {
    const d = new Date(o.createdAt);
    const diff = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
    if (diff >= 0 && diff < days) {
      buckets[days - 1 - diff] += 1;
    }
  }
  return buckets;
}

export default function AdminDashboardPage() {
  const session = useAdminAuthStore((s) => s.session);
  const perms = session?.permissions ?? [];
  const storeOrders = useOrdersStore((s) => s.orders);
  const ensureSeeds = useOrdersStore((s) => s.ensureSeeds);
  const extraOrders = useAdminOpsStore((s) => s.extraOrders);
  const ensureOps = useAdminOpsStore((s) => s.ensureSeeded);
  const overrides = useAdminOpsStore((s) => s.productOverrides);
  const customProducts = useAdminOpsStore((s) => s.customProducts);
  const hydrated = useAdminOpsStore((s) => s.hydrated);

  useEffect(() => {
    ensureSeeds();
    ensureOps();
  }, [ensureSeeds, ensureOps]);

  const orders = useMemo(
    () => combineOrders(storeOrders, extraOrders),
    [storeOrders, extraOrders]
  );

  const products = useMemo(
    () => mergeProducts(overrides, customProducts),
    [overrides, customProducts]
  );

  const kpis = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const revenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingPayment = orders.filter((o) => o.status === "pending_payment");
    const paymentReview = orders.filter((o) => o.status === "payment_review");
    const lowStock = products.filter(
      (p) => p.isActive !== false && (p.stockStatus === "low_stock" || p.stockStatus === "out_of_stock")
    );
    return {
      orders: orders.length,
      revenue,
      products: products.filter((p) => p.isActive !== false).length,
      customers: deriveCustomers(orders).length,
      pendingPayment,
      paymentReview,
      lowStock,
    };
  }, [orders, products]);

  const revenueSeries = useMemo(() => lastNDaysRevenue(orders, 7), [orders]);
  const orderSeries = useMemo(() => lastNDaysOrderCounts(orders, 7), [orders]);
  const recent = useMemo(() => orders.slice(0, 6), [orders]);

  const cards = [
    {
      label: "الطلبات",
      value: kpis.orders.toLocaleString("ar-YE"),
      icon: ShoppingBag,
      tone: "bg-sky-50 text-sky-700",
      spark: orderSeries,
      sparkType: "bar" as const,
    },
    {
      label: "الإيرادات (ر.ي)",
      value: formatPriceShort(kpis.revenue),
      icon: Wallet,
      tone: "bg-emerald-50 text-emerald-700",
      spark: revenueSeries,
      sparkType: "line" as const,
    },
    {
      label: "المنتجات النشطة",
      value: kpis.products.toLocaleString("ar-YE"),
      icon: Package,
      tone: "bg-henna-50 text-henna",
      spark: null,
      sparkType: null,
    },
    {
      label: "العملاء",
      value: kpis.customers.toLocaleString("ar-YE"),
      icon: UsersRound,
      tone: "bg-gold-50 text-gold-600",
      spark: null,
      sparkType: null,
    },
  ];

  const quickLinks = [
    {
      href: "/admin/orders",
      label: "الطلبات",
      icon: ShoppingBag,
      show: hasAnyPermission(perms, ["orders.view", "orders.manage"]),
    },
    {
      href: "/admin/products",
      label: "المنتجات",
      icon: Package,
      show: hasAnyPermission(perms, ["products.view", "products.manage"]),
    },
    {
      href: "/admin/offers",
      label: "العروض",
      icon: Tag,
      show: hasAnyPermission(perms, ["offers.manage"]),
    },
    {
      href: "/admin/categories",
      label: "الأقسام",
      icon: FolderTree,
      show: hasAnyPermission(perms, ["categories.manage"]),
    },
    {
      href: "/admin/activity",
      label: "سجل النشاط",
      icon: ScrollText,
      show: hasAnyPermission(perms, ["dashboard.view"]),
    },
    {
      href: "/admin/settings",
      label: "الإعدادات",
      icon: Settings,
      show: hasAnyPermission(perms, ["settings.manage"]),
    },
  ].filter((l) => l.show);

  if (!hydrated && !orders.length) {
    return (
      <AdminShell title="لوحة التحكم">
        <AdminKpiSkeleton />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="لوحة التحكم">
      <AdminPageHeader
        title={`مرحبًا${session ? `، ${session.name}` : ""}`}
        description="نظرة سريعة على المتجر — بيانات وهمية جاهزة للتشغيل"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="admin-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-ink-muted">{c.label}</p>
                  <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{c.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${c.tone}`}>
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
              </div>
              {c.spark && c.sparkType === "line" && (
                <div className="mt-3">
                  <Sparkline values={c.spark} strokeClassName="stroke-emerald-600" fillClassName="fill-emerald-500/10" />
                  <p className="mt-1 text-[10px] text-ink-light">آخر 7 أيام</p>
                </div>
              )}
              {c.spark && c.sparkType === "bar" && (
                <div className="mt-3">
                  <BarSpark values={c.spark} barClassName="bg-sky-400/80" />
                  <p className="mt-1 text-[10px] text-ink-light">طلبات يومية</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="admin-card lg:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <Clock className="h-4 w-4 text-amber-600" />
            بانتظار الدفع / المراجعة
          </h3>
          {kpis.pendingPayment.length + kpis.paymentReview.length === 0 ? (
            <p className="text-xs text-ink-muted">لا طلبات معلّقة حاليًا</p>
          ) : (
            <ul className="space-y-2">
              {[...kpis.pendingPayment, ...kpis.paymentReview].slice(0, 5).map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${encodeURIComponent(o.id)}`}
                    className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/80 px-3 py-2 text-xs transition hover:bg-amber-100"
                  >
                    <span className="font-semibold text-ink">{o.id}</span>
                    <span className="text-ink-muted">{formatPriceShort(o.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
            تلميح: للتحويل البنكي اطلبي إيصال واتساب من العميلة قبل تأكيد الدفع.
          </p>
        </div>

        <div className="admin-card lg:col-span-1">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            تنبيهات المخزون
          </h3>
          {kpis.lowStock.length === 0 ? (
            <p className="text-xs text-ink-muted">كل المنتجات بمخزون كافٍ</p>
          ) : (
            <ul className="space-y-2">
              {kpis.lowStock.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs transition",
                      p.stockStatus === "out_of_stock"
                        ? "bg-red-50 hover:bg-red-100"
                        : "bg-amber-50 hover:bg-amber-100"
                    )}
                  >
                    <span className="truncate font-semibold text-ink">{p.name}</span>
                    <span className="shrink-0 text-ink-muted">
                      {p.stock.toLocaleString("ar-YE")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {kpis.lowStock.length > 5 && (
            <Link
              href="/admin/products?stock=low_stock"
              className="mt-2 inline-block text-[11px] font-semibold text-henna hover:underline"
            >
              عرض الكل ({kpis.lowStock.length})
            </Link>
          )}
        </div>

        <div className="admin-card lg:col-span-1">
          <h3 className="mb-3 text-sm font-bold text-ink">روابط سريعة</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-cream-200 bg-cream-50/80 px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-henna-200 hover:bg-henna-50"
                >
                  <Icon className="h-3.5 w-3.5 text-henna" strokeWidth={1.75} />
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="admin-table-wrap mt-6">
        <div className="flex items-center justify-between gap-3 border-b border-cream-200 px-4 py-3.5 sm:px-5">
          <h2 className="text-sm font-bold text-ink sm:text-base">أحدث الطلبات</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-henna hover:underline"
          >
            عرض الكل
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-ink-muted">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table min-w-[640px]">
              <thead>
                <tr>
                  <th>رقم الطلب</th>
                  <th>العميلة</th>
                  <th>الحالة</th>
                  <th>الإجمالي</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className="font-semibold text-ink">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(o.id)}`}
                        className="hover:text-henna hover:underline"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="text-ink-muted">{o.customer.name}</td>
                    <td>
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="font-semibold text-ink">
                      {formatPriceShort(o.total)}
                    </td>
                    <td className="text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("ar-YE", {
                        timeZone: "Asia/Riyadh",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
