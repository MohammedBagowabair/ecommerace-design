"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Pencil, Plus, Search, CheckSquare } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { AdminStockBadge } from "@/components/admin/AdminStockBadge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { mergeCategories, mergeProducts } from "@/lib/admin/merged-catalog";
import { formatPriceShort, cn } from "@/lib/utils";
import type { StockStatus } from "@/lib/types";

const PAGE_SIZE = 10;

function AdminProductsPageInner() {
  const searchParams = useSearchParams();
  const canView = useAdminAuthStore((s) => {
    const p = s.session?.permissions ?? [];
    return p.includes("products.view") || p.includes("products.manage");
  });
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("products.manage")
  );
  const session = useAdminAuthStore((s) => s.session);
  const overrides = useAdminOpsStore((s) => s.productOverrides);
  const customProducts = useAdminOpsStore((s) => s.customProducts);
  const catOverrides = useAdminOpsStore((s) => s.categoryOverrides);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const bulkSet = useAdminOpsStore((s) => s.bulkSetProductActive);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const showToast = useToastStore((s) => s.show);

  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState<"all" | StockStatus>("all");
  const [flag, setFlag] = useState<"all" | "featured" | "offer" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkConfirm, setBulkConfirm] = useState<"activate" | "deactivate" | null>(null);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  useEffect(() => {
    const s = searchParams.get("stock");
    if (s === "low_stock" || s === "out_of_stock" || s === "in_stock") {
      setStock(s);
    }
  }, [searchParams]);

  const products = useMemo(
    () => mergeProducts(overrides, customProducts),
    [overrides, customProducts]
  );
  const categories = useMemo(
    () => mergeCategories(catOverrides, products),
    [catOverrides, products]
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && !p.categoryIds.includes(category)) return false;
      if (stock === "low_stock") {
        if (p.stockStatus !== "low_stock" && p.stockStatus !== "out_of_stock") return false;
      } else if (stock !== "all" && p.stockStatus !== stock) return false;
      if (flag === "featured" && !p.isFeatured) return false;
      if (flag === "offer" && !p.isOffer && !p.compareAtPrice) return false;
      if (flag === "inactive" && p.isActive !== false) return false;
      if (!query) return true;
      const hay = `${p.name} ${p.sku} ${p.id}`.toLowerCase();
      return hay.includes(query);
    });
  }, [products, q, category, stock, flag]);

  useEffect(() => {
    setPage(1);
    setSelected([]);
  }, [q, category, stock, flag]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.includes(p.id));

  const toggleAll = () => {
    if (allPageSelected) {
      setSelected((prev) => prev.filter((id) => !pageItems.some((p) => p.id === id)));
    } else {
      setSelected((prev) => [
        ...prev,
        ...pageItems.map((p) => p.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const applyBulk = (isActive: boolean) => {
    if (!canManage || !selected.length) return;
    bulkSet(selected, isActive);
    addActivity({
      actorName: session?.name ?? "مشرف",
      action: isActive ? "تفعيل منتجات بالجملة" : "تعطيل منتجات بالجملة",
      target: `${selected.length} منتج`,
    });
    showToast(
      isActive ? `تم تفعيل ${selected.length} منتج` : `تم تعطيل ${selected.length} منتج`,
      "success"
    );
    setSelected([]);
    setBulkConfirm(null);
  };

  if (!canView) {
    return (
      <AdminShell title="المنتجات">
        <PermissionDenied message="ليس لديك صلاحية عرض المنتجات." />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="المنتجات">
      <AdminPageHeader
        title="المنتجات"
        description="إدارة المخزون والأسعار والصور — تجاوزات محلية فقط"
        breadcrumbs={[{ label: "المنتجات" }]}
        actions={
          canManage ? (
            <Link href="/admin/products/new" className="btn-primary w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              منتج جديد
            </Link>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">{filtered.length} منتج</p>
        {!canManage && (
          <p className="text-xs text-ink-muted">وضع المشاهدة — التعديل معطّل</p>
        )}
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light" />
          <input
            className="input-pill ps-10"
            placeholder="بحث بالاسم أو SKU…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">كل الأقسام</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
          value={stock}
          onChange={(e) => setStock(e.target.value as typeof stock)}
        >
          <option value="all">كل المخزون</option>
          <option value="in_stock">متوفر</option>
          <option value="low_stock">منخفض / نفد</option>
          <option value="out_of_stock">نفد فقط</option>
        </select>
        <select
          className="w-full rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm"
          value={flag}
          onChange={(e) => setFlag(e.target.value as typeof flag)}
        >
          <option value="all">كل العلامات</option>
          <option value="featured">مميز</option>
          <option value="offer">عرض</option>
          <option value="inactive">غير نشط</option>
        </select>
      </div>

      {canManage && selected.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-henna-200 bg-henna-50/60 px-3 py-2.5">
          <CheckSquare className="h-4 w-4 text-henna" />
          <span className="text-xs font-semibold text-ink">
            {selected.length} محدد
          </span>
          <button
            type="button"
            className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-700"
            onClick={() => setBulkConfirm("activate")}
          >
            تفعيل
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-700"
            onClick={() => setBulkConfirm("deactivate")}
          >
            تعطيل
          </button>
          <button
            type="button"
            className="text-xs text-ink-muted hover:underline"
            onClick={() => setSelected([])}
          >
            إلغاء التحديد
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-[920px]">
            <thead>
              <tr className="text-start">
                {canManage && (
                  <th className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleAll}
                      aria-label="تحديد الكل في الصفحة"
                    />
                  </th>
                )}
                <th className="px-4 py-2.5 font-semibold">المنتج</th>
                <th className="px-4 py-2.5 font-semibold">SKU</th>
                <th className="px-4 py-2.5 font-semibold">السعر</th>
                <th className="px-4 py-2.5 font-semibold">المخزون</th>
                <th className="px-4 py-2.5 font-semibold">علامات</th>
                <th className="px-4 py-2.5 font-semibold">الحالة</th>
                <th className="px-4 py-2.5 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className="border-b border-cream-100 last:border-0">
                  {canManage && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(p.id)
                              ? prev.filter((x) => x !== p.id)
                              : [...prev, p.id]
                          )
                        }
                        aria-label={`تحديد ${p.name}`}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                        <Image
                          src={p.images[0] ?? ""}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{p.name}</p>
                        <p className="text-xs text-ink-muted">
                          {p.id}
                          {p.isCustom ? " · مخصص" : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted" dir="ltr">
                    {p.sku}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">
                    {formatPriceShort(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <AdminStockBadge status={p.stockStatus} stock={p.stock} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.isFeatured && (
                        <span className="badge-pill bg-henna-50 text-henna">مميز</span>
                      )}
                      {p.isOffer && (
                        <span className="badge-pill bg-gold-50 text-gold-600">عرض</span>
                      )}
                      {p.isNew && (
                        <span className="badge-pill bg-sky-50 text-sky-700">جديد</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "badge-pill",
                        p.isActive !== false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      )}
                    >
                      {p.isActive !== false ? "نشط" : "معطّل"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-cream-300 px-2 py-1 text-xs font-semibold text-ink hover:bg-cream-50"
                    >
                      <Pencil className="h-3 w-3" />
                      {canManage ? "تعديل" : "عرض"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">لا نتائج مطابقة</p>
        )}
        <AdminPagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={bulkConfirm !== null}
        title={bulkConfirm === "activate" ? "تفعيل المنتجات؟" : "تعطيل المنتجات؟"}
        description={`سيتم ${bulkConfirm === "activate" ? "تفعيل" : "تعطيل"} ${selected.length} منتج محدد.`}
        confirmLabel={bulkConfirm === "activate" ? "تفعيل" : "تعطيل"}
        tone={bulkConfirm === "deactivate" ? "danger" : "default"}
        onCancel={() => setBulkConfirm(null)}
        onConfirm={() => applyBulk(bulkConfirm === "activate")}
      />
    </AdminShell>
  );
}


export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="المنتجات">
          <div className="h-40 animate-pulse rounded-2xl bg-cream-200" />
        </AdminShell>
      }
    >
      <AdminProductsPageInner />
    </Suspense>
  );
}
