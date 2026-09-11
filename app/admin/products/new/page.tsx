"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PermissionDenied } from "@/components/admin/PermissionDenied";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminOpsStore, blankCustomProduct } from "@/lib/store/admin-ops";
import { useToastStore } from "@/lib/store/toast";
import { mergeCategories, mergeProducts, slugifyArabic } from "@/lib/admin/merged-catalog";
import { getStockStatus, cn } from "@/lib/utils";
import type { ProductBadge } from "@/lib/types";

const BADGE_OPTIONS: { id: ProductBadge; label: string }[] = [
  { id: "new", label: "جديد" },
  { id: "featured", label: "مميز" },
  { id: "bestseller", label: "الأكثر مبيعًا" },
  { id: "discount", label: "خصم" },
  { id: "limited", label: "محدود" },
];

export default function AdminProductNewPage() {
  const router = useRouter();
  const canManage = useAdminAuthStore((s) =>
    (s.session?.permissions ?? []).includes("products.manage")
  );
  const session = useAdminAuthStore((s) => s.session);
  const overrides = useAdminOpsStore((s) => s.productOverrides);
  const customProducts = useAdminOpsStore((s) => s.customProducts);
  const catOverrides = useAdminOpsStore((s) => s.categoryOverrides);
  const addCustomProduct = useAdminOpsStore((s) => s.addCustomProduct);
  const addActivity = useAdminOpsStore((s) => s.addActivity);
  const ensureSeeded = useAdminOpsStore((s) => s.ensureSeeded);
  const showToast = useToastStore((s) => s.show);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(5000);
  const [compareAt, setCompareAt] = useState("");
  const [stock, setStock] = useState(10);
  const [sku, setSku] = useState("");
  const [image1, setImage1] = useState(
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
  );
  const [image2, setImage2] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [badges, setBadges] = useState<ProductBadge[]>(["new"]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  const categories = useMemo(() => {
    const products = mergeProducts(overrides, customProducts);
    return mergeCategories(catOverrides, products);
  }, [overrides, customProducts, catOverrides]);

  if (!canManage) {
    return (
      <AdminShell title="منتج جديد">
        <PermissionDenied message="ليس لديك صلاحية إنشاء منتجات." />
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
    const errs: string[] = [];
    if (!name.trim()) errs.push("الاسم مطلوب");
    if (!Number.isFinite(price) || price <= 0) errs.push("السعر يجب أن يكون أكبر من صفر");
    if (stock < 0) errs.push("المخزون لا يمكن أن يكون سالبًا");
    if (!image1.trim()) errs.push("رابط الصورة الأولى مطلوب");
    if (errs.length) {
      setErrors(errs);
      showToast(errs[0], "error");
      return;
    }
    setErrors([]);
    const images = [image1.trim(), image2.trim()].filter(Boolean);
    const compareNum = compareAt.trim() === "" ? undefined : Number(compareAt);
    const product = blankCustomProduct({
      name: name.trim(),
      description: description.trim() || `وصف ${name.trim()}`,
      price,
      compareAtPrice:
        compareNum !== undefined && Number.isFinite(compareNum)
          ? compareNum
          : undefined,
      stock,
      stockStatus: getStockStatus(stock),
      sku: sku.trim() || undefined,
      slug: slugifyArabic(name),
      categoryIds,
      badges,
      images,
      isFeatured,
      isOffer,
      isNew: true,
    });
    const id = addCustomProduct(product);
    addActivity({
      actorName: session?.name ?? "مشرف",
      action: "إنشاء منتج",
      target: product.name,
      meta: id,
    });
    showToast("تم إنشاء المنتج (محليًا في لوحة الإدارة)", "success");
    router.push(`/admin/products/${id}`);
  };

  return (
    <AdminShell title="منتج جديد">
      <AdminPageHeader
        title="منتج جديد"
        description="يُحفظ في لوحة الإدارة فقط (localStorage) ولا يظهر تلقائيًا في واجهة المتجر"
        breadcrumbs={[
          { label: "المنتجات", href: "/admin/products" },
          { label: "جديد" },
        ]}
      />

      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-cream-300 bg-white p-4 shadow-card sm:p-6">
        {errors.length > 0 && (
          <ul className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">الاسم *</span>
          <input
            className="input-pill"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: نقشة العروس الناعمة"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">الوصف</span>
          <textarea
            className="w-full rounded-xl border border-cream-300 px-3 py-2.5 text-sm"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">السعر *</span>
            <input
              type="number"
              className="input-pill"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">سعر قبل الخصم</span>
            <input
              type="number"
              className="input-pill"
              value={compareAt}
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
              onChange={(e) => setStock(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-semibold text-ink">SKU</span>
          <input
            className="input-pill"
            dir="ltr"
            value={sku}
            placeholder="يُولَّد تلقائيًا إن تُرك فارغًا"
            onChange={(e) => setSku(e.target.value)}
          />
        </label>

        <div className="space-y-2">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">رابط الصورة 1 *</span>
            <input
              className="input-pill"
              dir="ltr"
              value={image1}
              onChange={(e) => setImage1(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold text-ink">رابط الصورة 2</span>
            <input
              className="input-pill"
              dir="ltr"
              value={image2}
              onChange={(e) => setImage2(e.target.value)}
            />
          </label>
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
                  onClick={() => toggleCat(c.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    on
                      ? "border-henna bg-henna-50 text-henna"
                      : "border-cream-300 bg-white text-ink-muted"
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
                  onClick={() => toggleBadge(b.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold",
                    on
                      ? "border-henna bg-henna-50 text-henna"
                      : "border-cream-300 bg-white text-ink-muted"
                  )}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            مميز
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-cream-200 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={isOffer}
              onChange={(e) => setIsOffer(e.target.checked)}
            />
            عرض
          </label>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button type="button" className="btn-primary" onClick={save}>
            إنشاء المنتج
          </button>
          <Link href="/admin/products" className="btn-secondary">
            إلغاء
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
