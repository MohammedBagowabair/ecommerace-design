"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import {
  mergeCategories,
  mergeProductById,
  mergeProducts,
} from "@/lib/admin/merged-catalog";
import { getStockStatus, cn } from "@/lib/utils";
import type { ProductBadge } from "@/lib/types";

const BADGE_OPTIONS: { id: ProductBadge; label: string }[] = [
  { id: "new", label: "جديد" },
  { id: "featured", label: "مميز" },
  { id: "bestseller", label: "الأكثر مبيعًا" },
  { id: "discount", label: "خصم" },
  { id: "limited", label: "محدود" },
];

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
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
  const setProductOverride = useAdminOpsStore((s) => s.setProductOverride);
  const clearProductOverride = useAdminOpsStore((s) => s.clearProductOverride);
  const updateCustomProduct = useAdminOpsStore((s) => s.updateCustomProduct);
  const deleteCustomProduct = useAdminOpsStore((s) => s.deleteCustomProduct);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const hydrated = useAdminOpsStore((s) => s.hydrated);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    ensureSeeded();
    const t = window.setTimeout(() => {
      if (!useAdminOpsStore.getState().hydrated) {
        useAdminOpsStore.getState().setHydrated(true);
        useAdminOpsStore.getState().ensureSeeded();
      }
    }, 50);
    return () => window.clearTimeout(t);
  }, [ensureSeeded]);

  const product = useMemo(
    () => mergeProductById(id, overrides, customProducts),
    [id, overrides, customProducts]
  );
  const categories = useMemo(() => {
    const products = mergeProducts(overrides, customProducts);
    return mergeCategories(catOverrides, products);
  }, [overrides, customProducts, catOverrides]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [compareAt, setCompareAt] = useState<string>("");
  const [stock, setStock] = useState(0);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [badges, setBadges] = useState<ProductBadge[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!product) {
      setReady(true);
      return;
    }
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCompareAt(
      product.compareAtPrice != null ? String(product.compareAtPrice) : ""
    );
    setStock(product.stock);
    setImage1(product.images[0] ?? "");
    setImage2(product.images[1] ?? "");
    setImage3(product.images[2] ?? "");
    setCategoryIds([...product.categoryIds]);
    setBadges([...product.badges]);
    setIsFeatured(!!product.isFeatured);
    setIsOffer(!!product.isOffer);
    setIsNew(!!product.isNew);
    setIsBestseller(!!product.isBestseller);
    setIsActive(product.isActive !== false);
    setReady(true);
  }, [product, hydrated]);

  if (!canView) {
    return (
      <AdminShell title="تعديل منتج">
        <PermissionDenied message="ليس لديك صلاحية عرض المنتجات." />
      </AdminShell>
    );
  }

  if (!hydrated || !ready) {
    return (
      <AdminShell title="تعديل منتج">
        <div className="h-40 animate-pulse rounded-2xl bg-cream-200" />
      </AdminShell>
    );
  }

  if (!product) {
    return (
      <AdminShell title="تعديل منتج">
        <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center shadow-card">
          <p className="font-bold text-ink">المنتج غير موجود</p>
          <Link href="/admin/products" className="btn-primary mt-4 inline-flex">
            العودة للمنتجات
          </Link>
        </div>
      </AdminShell>
    );
  }

  const toggleCat = (cid: string) => {
    setCategoryIds((prev) =>
      prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]
    );
  };

  const toggleBadge = (b: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const save = () => {
    if (!canManage) return;
    if (!name.trim()) {
      showToast("الاسم مطلوب", "error");
      return;
    }
    const compareNum = compareAt.trim() === "" ? null : Number(compareAt);
    const images = [image1, image2, image3].map((s) => s.trim()).filter(Boolean);
    const patch = {
      name: name.trim() || product.name,
      description: description.trim(),
      price: Number.isFinite(price) ? price : product.price,
      compareAtPrice:
        compareNum === null
          ? null
          : Number.isFinite(compareNum)
            ? compareNum
            : product.compareAtPrice ?? null,
      stock,
      stockStatus: getStockStatus(stock),
      categoryIds,
      badges,
      images: images.length ? images : product.images,
      isFeatured,
      isOffer,
      isNew,
      isBestseller,
      isActive,
    };
    if (product.isCustom) {
      updateCustomProduct(id, {
        ...patch,
        compareAtPrice:
          patch.compareAtPrice === null ? undefined : patch.compareAtPrice ?? undefined,
        isActive,
      });
    }
    setProductOverride(id, patch);
    addActivity({
      actorName: session?.name ?? "مشرف",
      action: "تعديل منتج",
      target: patch.name,
    });
    showToast("تم حفظ تعديلات المنتج (محليًا)", "success");
    router.push("/admin/products");
  };

  return (
    <AdminShell title={canManage ? "تعديل منتج" : "عرض منتج"}>
      <AdminPageHeader
        title={product.name}
        breadcrumbs={[
          { label: "المنتجات", href: "/admin/products" },
          { label: canManage ? "تعديل" : "عرض" },
        ]}
      />

      <div className="mb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-henna hover:underline"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للمنتجات
        </Link>
      </div>

      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-6">
        <p className="text-xs text-ink-muted">
          التعديلات تُحفظ في localStorage (`naqshat-admin-ops`) — واجهة المتجر تبقى على
          البيانات الثابتة (دمج إداري فقط).
          {product.isCustom ? " هذا منتج مخصص أُنشئ من لوحة الإدارة." : ""}
        </p>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">الاسم</span>
          <input
            className="input-pill"
            value={name}
            disabled={!canManage}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">الوصف</span>
          <textarea
            className="w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm disabled:opacity-60"
            rows={3}
            value={description}
            disabled={!canManage}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">السعر</span>
            <input
              type="number"
              className="input-pill"
              value={price}
              disabled={!canManage}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">سعر قبل الخصم</span>
            <input
              type="number"
              className="input-pill"
              value={compareAt}
              disabled={!canManage}
              placeholder="اختياري"
              onChange={(e) => setCompareAt(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">المخزون</span>
            <input
              type="number"
              className="input-pill"
              value={stock}
              disabled={!canManage}
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink">روابط الصور</p>
          {[
            [image1, setImage1, "1"],
            [image2, setImage2, "2"],
            [image3, setImage3, "3"],
          ].map(([val, setter, label]) => (
            <label key={String(label)} className="block text-sm">
              <span className="mb-1 block text-xs text-ink-muted">صورة {String(label)}</span>
              <input
                className="input-pill"
                dir="ltr"
                value={val as string}
                disabled={!canManage}
                onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              />
            </label>
          ))}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">الأقسام</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const on = categoryIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={!canManage}
                  onClick={() => toggleCat(c.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    on
                      ? "border-henna bg-henna-50 text-henna"
                      : "border-cream-300 bg-white text-ink-muted",
                    !canManage && "opacity-60"
                  )}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-ink">الشارات</p>
          <div className="flex flex-wrap gap-2">
            {BADGE_OPTIONS.map((b) => {
              const on = badges.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  disabled={!canManage}
                  onClick={() => toggleBadge(b.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    on
                      ? "border-henna bg-henna-50 text-henna"
                      : "border-cream-300 bg-white text-ink-muted",
                    !canManage && "opacity-60"
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              ["isFeatured", "مميز", isFeatured, setIsFeatured],
              ["isOffer", "عرض", isOffer, setIsOffer],
              ["isNew", "جديد", isNew, setIsNew],
              ["isBestseller", "الأكثر مبيعًا", isBestseller, setIsBestseller],
              ["isActive", "نشط (تجاوز محلي)", isActive, setIsActive],
            ] as const
          ).map(([key, label, val, setter]) => (
            <label
              key={key}
              className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={val}
                disabled={!canManage}
                onChange={(e) => setter(e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {canManage && (
            <>
              <button type="button" className="btn-primary" onClick={save}>
                حفظ التعديلات
              </button>
              {!product.isCustom && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    clearProductOverride(id);
                    showToast("تمت إعادة المنتج لبيانات البذرة", "info");
                    router.push("/admin/products");
                  }}
                >
                  إعادة للافتراضي
                </button>
              )}
              {product.isCustom && (
                <button
                  type="button"
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                  onClick={() => {
                    deleteCustomProduct(id);
                    addActivity({
                      actorName: session?.name ?? "مشرف",
                      action: "حذف منتج مخصص",
                      target: product.name,
                    });
                    showToast("تم حذف المنتج المخصص", "info");
                    router.push("/admin/products");
                  }}
                >
                  حذف المنتج
                </button>
              )}
            </>
          )}
          <Link href="/admin/products" className="btn-secondary">
            إلغاء
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
