"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Copy,
  MapPin,
  MessageCircle,
  Store,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useOrdersStore } from "@/lib/store/orders";
import { useCustomerStore } from "@/lib/store/customer";
import { useToastStore } from "@/lib/store/toast";
import { getProductById } from "@/lib/data/products";
import {
  addressLabelText,
  bankAccounts as seedBanks,
  bankTransferNote,
  storeContact as seedContact,
  yemenGovernorates,
} from "@/lib/data/checkout";
import { useAdminOpsStore } from "@/lib/store/admin-ops";
import { buildDeliveryOptions } from "@/lib/delivery-settings";
import type {
  Address,
  AddressLabel,
  CustomerInfo,
  DeliveryMethodId,
  Order,
  OrderLineItem,
} from "@/lib/types";
import {
  buildWhatsAppReceiptLink,
  cn,
  formatPriceShort,
} from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CHECKOUT_STEPS,
  CheckoutSteps,
  type CheckoutStepId,
} from "./CheckoutSteps";
import { OrderSummaryCard } from "./OrderSummaryCard";

type AddressMode = "saved" | "new";

const emptyAddress = (): Omit<Address, "id"> => ({
  label: "home",
  governorate: "",
  city: "",
  area: "",
  street: "",
  details: "",
  phone: "",
  geo: "",
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      <span aria-hidden>⚠</span>
      <span>{message}</span>
    </p>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-cream-200/60 bg-white p-5 shadow-card sm:p-6", className)}>
      <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function CheckoutFlow() {
  const { items, clear } = useCartStore();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const getNextOrderId = useOrdersStore((s) => s.getNextOrderId);
  const showToast = useToastStore((s) => s.show);
  const profile = useCustomerStore((s) => s.profile);
  const savedAddresses = useCustomerStore((s) => s.addresses);
  const settings = useAdminOpsStore((s) => s.settings);
  const ensureOps = useAdminOpsStore((s) => s.ensureSeeded);

  useEffect(() => {
    ensureOps();
  }, [ensureOps]);

  const deliveryOptions = useMemo(
    () => buildDeliveryOptions(settings),
    [settings]
  );
  const bankAccounts =
    settings.bankAccounts?.length > 0 ? settings.bankAccounts : seedBanks;
  const storeContact = {
    whatsapp: settings.whatsapp || seedContact.whatsapp,
    whatsappDisplay: settings.whatsappDisplay || seedContact.whatsappDisplay,
  };

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStepId | "success">("customer");
  const [customer, setCustomer] = useState<CustomerInfo>({ name: "", phone: "" });
  const [customerErrors, setCustomerErrors] = useState<Partial<CustomerInfo>>({});
  const [addressMode, setAddressMode] = useState<AddressMode>("saved");
  const [savedId, setSavedId] = useState("");
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [deliveryId, setDeliveryId] = useState<DeliveryMethodId>("standard");
  const [selectedBankId, setSelectedBankId] = useState(seedBanks[0].id);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!deliveryOptions.some((d) => d.id === deliveryId)) {
      setDeliveryId((deliveryOptions[0]?.id as DeliveryMethodId) ?? "standard");
    }
  }, [deliveryOptions, deliveryId]);

  useEffect(() => {
    if (bankAccounts.length && !bankAccounts.some((b) => b.id === selectedBankId)) {
      setSelectedBankId(bankAccounts[0].id);
    }
  }, [bankAccounts, selectedBankId]);

  useEffect(() => {
    setMounted(true);
    setCustomer({ name: profile.name || "", phone: profile.phone || "" });
    if (savedAddresses[0]) {
      setSavedId((prev) => prev || savedAddresses[0].id);
      setAddressMode("saved");
    } else {
      setAddressMode("new");
    }
  }, [profile.name, profile.phone, savedAddresses]);

  const rows = useMemo(() => {
    return items
      .map((i) => {
        const product = getProductById(i.productId);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean) as {
      productId: string;
      quantity: number;
      product: NonNullable<ReturnType<typeof getProductById>>;
    }[];
  }, [items]);

  const available = rows.filter(
    (r) => r.product.stock > 0 && r.product.stockStatus !== "out_of_stock"
  );

  const subtotal = available.reduce((s, r) => s + r.product.price * r.quantity, 0);
  const compareSubtotal = available.reduce((s, r) => {
    const unit =
      r.product.compareAtPrice && r.product.compareAtPrice > r.product.price
        ? r.product.compareAtPrice
        : r.product.price;
    return s + unit * r.quantity;
  }, 0);
  const discount = compareSubtotal - subtotal;
  const delivery =
    deliveryOptions.find((d) => d.id === deliveryId) ?? deliveryOptions[0];
  const deliveryFee = delivery.fee;
  const total = subtotal + deliveryFee;

  const resolvedAddress = useMemo((): Address | null => {
    if (addressMode === "saved") {
      return savedAddresses.find((a) => a.id === savedId) ?? null;
    }
    return {
      id: `addr-new-${Date.now()}`,
      ...newAddress,
      details: newAddress.details || undefined,
      geo: newAddress.geo || undefined,
    };
  }, [addressMode, savedId, newAddress, savedAddresses]);

  if (!mounted) {
    return (
      <div className="container-pad py-10">
        <div className="h-48 animate-pulseSoft rounded-3xl bg-cream-200" />
      </div>
    );
  }

  if (step !== "success" && available.length === 0) {
    return (
      <div className="container-pad py-8">
        <EmptyState
          icon="cart"
          title="سلتك فارغة"
          description="أضيفي نقشات إلى السلة أولًا ثم ارجعي لإتمام الطلب."
          actionLabel="تصفحي النقشات"
          actionHref="/products"
        />
        <div className="mt-4 text-center">
          <Link href="/cart" className="text-sm font-semibold text-henna hover:underline">
            أو ارجعي إلى السلة
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex = CHECKOUT_STEPS.findIndex((s) => s.id === step);

  function validateCustomer(): boolean {
    const errors: Partial<CustomerInfo> = {};
    if (!customer.name.trim() || customer.name.trim().length < 2) {
      errors.name = "أدخلي الاسم الكامل";
    }
    const phone = customer.phone.replace(/\s+/g, "");
    if (!/^7\d{8}$/.test(phone) && !/^9677\d{8}$/.test(phone)) {
      errors.phone = "أدخلي رقم جوال يمني صحيح (مثال: 77xxxxxxx)";
    }
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateAddress(): boolean {
    if (addressMode === "saved") {
      if (!savedId || !savedAddresses.some((a) => a.id === savedId)) {
        setAddressErrors({ saved: "اختاري عنوانًا محفوظًا" });
        return false;
      }
      setAddressErrors({});
      return true;
    }
    const e: Record<string, string> = {};
    if (!newAddress.governorate) e.governorate = "اختاري المحافظة";
    if (!newAddress.city.trim()) e.city = "أدخلي المدينة";
    if (!newAddress.area.trim()) e.area = "أدخلي الحي / المنطقة";
    if (!newAddress.street.trim()) e.street = "أدخلي الشارع";
    const phone = newAddress.phone.replace(/\s+/g, "");
    if (!/^7\d{8}$/.test(phone) && !/^9677\d{8}$/.test(phone)) {
      e.phone = "أدخلي رقم تواصل صحيح";
    }
    setAddressErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (step === "customer") {
      if (!validateCustomer()) return;
      setStep("address");
      return;
    }
    if (step === "address") {
      if (!validateAddress()) return;
      setStep("delivery");
      return;
    }
    if (step === "delivery") {
      setStep("payment");
      return;
    }
    if (step === "payment") {
      setStep("review");
      return;
    }
  }

  function goBack() {
    if (step === "address") setStep("customer");
    else if (step === "delivery") setStep("address");
    else if (step === "payment") setStep("delivery");
    else if (step === "review") setStep("payment");
  }

  function copyText(label: string, value: string) {
    void navigator.clipboard?.writeText(value).then(
      () => showToast(`تم نسخ ${label}`, "success"),
      () => showToast("تعذّر النسخ", "error")
    );
  }

  function confirmOrder() {
    if (!resolvedAddress || available.length === 0) return;
    setSubmitting(true);
    const orderId = getNextOrderId();
    const lineItems: OrderLineItem[] = available.map((r) => ({
      productId: r.product.id,
      name: r.product.name,
      image: r.product.images[0],
      price: r.product.price,
      compareAtPrice: r.product.compareAtPrice,
      quantity: r.quantity,
    }));

    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "payment_review",
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.replace(/\s+/g, ""),
      },
      address: resolvedAddress,
      deliveryMethodId: deliveryId,
      deliveryFee,
      paymentMethodId: "bank_transfer",
      bankAccountId: selectedBankId,
      items: lineItems,
      subtotal,
      discount,
      total,
      currency: "YER",
    };

    addOrder(order);
    clear();
    setPlacedOrder(order);
    setStep("success");
    setSubmitting(false);
    showToast("تم إنشاء طلبك بنجاح", "success");
  }

  const waLink = placedOrder
    ? buildWhatsAppReceiptLink(
        storeContact.whatsapp,
        placedOrder.id,
        formatPriceShort(placedOrder.total)
      )
    : "#";

  if (step === "success" && placedOrder) {
    return (
      <div className="container-pad py-8 sm:py-12">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-card animate-fadeIn">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-ink">تم إنشاء طلبك بنجاح 🎉</h1>
          <p className="mt-2 text-sm text-ink-muted">
            رقم الطلب:{" "}
            <span className="font-bold text-henna" dir="ltr">
              {placedOrder.id}
            </span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            {bankTransferNote}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">
            الإجمالي: {formatPriceShort(placedOrder.total)}
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            إرسال إيصال التحويل عبر واتساب
          </a>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link
              href={`/account/orders/${placedOrder.id}`}
              className="btn-outline w-full"
            >
              تفاصيل الطلب
            </Link>
            <Link href="/account/orders" className="btn-outline w-full">
              طلباتي
            </Link>
          </div>
          <Link href="/products" className="mt-2 inline-block text-sm font-semibold text-henna hover:underline">
            متابعة التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-pad pb-24 pt-5 sm:py-8 sm:pb-8">
      <div className="mb-6">
        <h1 className="page-title">إتمام الطلب</h1>
        <p className="page-subtitle">
          خطوة بخطوة — الدفع عبر التحويل البنكي فقط. يمكنكِ الرجوع في أي وقت.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-cream-200/60 bg-white px-3 py-5 shadow-card sm:px-6">
        <CheckoutSteps current={step as CheckoutStepId} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {step === "customer" && (
            <SectionCard title="بيانات العميلة" subtitle="نستخدمها للتواصل وتأكيد الطلب فقط">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input-pill"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, name: e.target.value }))
                    }
                    placeholder="مثال: سارة أحمد"
                    autoComplete="name"
                  />
                  <FieldError message={customerErrors.name} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input-pill"
                    dir="ltr"
                    inputMode="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="77xxxxxxx"
                    autoComplete="tel"
                  />
                  <FieldError message={customerErrors.phone} />
                  {!customerErrors.phone && (
                    <p className="field-hint">مثال يمني: 77xxxxxxx أو 9677xxxxxxx</p>
                  )}
                </div>
              </div>
            </SectionCard>
          )}

          {step === "address" && (
            <SectionCard title="عنوان التوصيل" subtitle="حدّدي أين نستلم الطلب — محفوظ أو جديد">
              <div className="mb-4 flex gap-2 rounded-full bg-cream-100 p-1">
                <button
                  type="button"
                  className={cn(
                    "flex-1 rounded-full py-2.5 text-sm font-semibold transition",
                    addressMode === "saved"
                      ? "bg-white text-ink shadow-card"
                      : "text-ink-muted"
                  )}
                  onClick={() => setAddressMode("saved")}
                >
                  عنوان محفوظ
                </button>
                <button
                  type="button"
                  className={cn(
                    "flex-1 rounded-full py-2.5 text-sm font-semibold transition",
                    addressMode === "new"
                      ? "bg-white text-ink shadow-card"
                      : "text-ink-muted"
                  )}
                  onClick={() => setAddressMode("new")}
                >
                  عنوان جديد
                </button>
              </div>

              {addressMode === "saved" ? (
                <div className="space-y-3">
                  {!savedAddresses.length && (
                    <p className="rounded-2xl bg-cream-50 p-4 text-sm text-ink-muted">
                      لا عناوين محفوظة. أضيفي عنوانًا من{" "}
                      <Link href="/account/addresses" className="font-semibold text-henna underline">
                        عناويني
                      </Link>{" "}
                      أو اختاري «عنوان جديد».
                    </p>
                  )}
                  {savedAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                        savedId === addr.id
                          ? "border-henna bg-henna-50"
                          : "border-cream-200 hover:border-henna-200"
                      )}
                    >
                      <input
                        type="radio"
                        name="saved-address"
                        className="mt-1 accent-henna"
                        checked={savedId === addr.id}
                        onChange={() => setSavedId(addr.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-henna" />
                          <span className="text-sm font-bold text-ink">
                            {addressLabelText[addr.label]}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">
                          {addr.governorate} · {addr.city} · {addr.area}
                        </p>
                        <p className="text-sm text-ink-muted">
                          {addr.street}
                          {addr.details ? ` — ${addr.details}` : ""}
                        </p>
                        <p className="mt-1 text-xs text-ink-light" dir="ltr">
                          {addr.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                  <FieldError message={addressErrors.saved} />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <p className="mb-2 text-sm font-semibold text-ink">تسمية العنوان</p>
                    <div className="flex gap-2">
                      {(["home", "work"] as AddressLabel[]).map((label) => (
                        <button
                          key={label}
                          type="button"
                          className={cn(
                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                            newAddress.label === label
                              ? "bg-ink text-white"
                              : "bg-cream-100 text-ink-muted hover:bg-cream-200"
                          )}
                          onClick={() =>
                            setNewAddress((a) => ({ ...a, label }))
                          }
                        >
                          {addressLabelText[label]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      المحافظة *
                    </label>
                    <select
                      className="input-pill appearance-none"
                      value={newAddress.governorate}
                      onChange={(e) =>
                        setNewAddress((a) => ({
                          ...a,
                          governorate: e.target.value,
                        }))
                      }
                    >
                      <option value="">اختاري المحافظة</option>
                      {yemenGovernorates.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <FieldError message={addressErrors.governorate} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      المدينة *
                    </label>
                    <input
                      className="input-pill"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, city: e.target.value }))
                      }
                      placeholder="المدينة"
                    />
                    <FieldError message={addressErrors.city} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      الحي / المنطقة *
                    </label>
                    <input
                      className="input-pill"
                      value={newAddress.area}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, area: e.target.value }))
                      }
                      placeholder="الحي"
                    />
                    <FieldError message={addressErrors.area} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      الشارع *
                    </label>
                    <input
                      className="input-pill"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, street: e.target.value }))
                      }
                      placeholder="اسم الشارع"
                    />
                    <FieldError message={addressErrors.street} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      تفاصيل إضافية
                    </label>
                    <textarea
                      className="w-full rounded-3xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-light focus:border-henna-300 focus:bg-white focus:ring-2 focus:ring-henna-100"
                      rows={2}
                      value={newAddress.details}
                      onChange={(e) =>
                        setNewAddress((a) => ({
                          ...a,
                          details: e.target.value,
                        }))
                      }
                      placeholder="معلم قريب، رقم المبنى، الدور…"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      هاتف العنوان *
                    </label>
                    <input
                      className="input-pill"
                      dir="ltr"
                      inputMode="tel"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, phone: e.target.value }))
                      }
                      placeholder="77xxxxxxx"
                    />
                    <FieldError message={addressErrors.phone} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      موقع جغرافي (اختياري)
                    </label>
                    <input
                      className="input-pill"
                      dir="ltr"
                      value={newAddress.geo}
                      onChange={(e) =>
                        setNewAddress((a) => ({ ...a, geo: e.target.value }))
                      }
                      placeholder="15.3, 44.2 أو رابط خريطة"
                    />
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {step === "delivery" && (
            <SectionCard title="طريقة التوصيل" subtitle="اختاري الأنسب لمدينتكِ">
              <div className="space-y-3">
                {deliveryOptions.map((opt) => {
                  const Icon = opt.id === "pickup" ? Store : Truck;
                  const selected = deliveryId === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-2xl border p-4 transition",
                        selected
                          ? "border-henna bg-henna-50"
                          : "border-cream-200 hover:border-henna-200"
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        className="mt-1 accent-henna"
                        checked={selected}
                        onChange={() => setDeliveryId(opt.id)}
                      />
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-henna shadow-card">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-bold text-ink">{opt.name}</p>
                          <p className="text-sm font-bold text-henna">
                            {opt.fee === 0 ? "مجاني" : formatPriceShort(opt.fee)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-ink-muted">
                          {opt.description}
                        </p>
                        <p className="mt-1 text-xs text-ink-light">
                          المدة المتوقعة: {opt.eta}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {step === "payment" && (
            <SectionCard title="التحويل البنكي" subtitle="اختاري الحساب ثم انسخي الرقم بسهولة">
              <div className="mb-4 rounded-2xl bg-gold-50 px-4 py-3 text-sm leading-relaxed text-henna-700">
                {bankTransferNote}
              </div>
              <p className="mb-3 text-sm text-ink-muted">
                اختاري الحساب الذي ستحوّلين إليه، ثم انسخي البيانات:
              </p>
              <div className="space-y-3">
                {bankAccounts.map((bank) => {
                  const selected = selectedBankId === bank.id;
                  return (
                    <label
                      key={bank.id}
                      className={cn(
                        "block cursor-pointer rounded-2xl border p-4 transition",
                        selected
                          ? "border-henna bg-henna-50"
                          : "border-cream-200 hover:border-henna-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="bank"
                          className="mt-1 accent-henna"
                          checked={selected}
                          onChange={() => setSelectedBankId(bank.id)}
                        />
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-henna shadow-card">
                          <Building2 className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="font-bold text-ink">{bank.bankName}</p>
                          <div className="grid gap-1.5 text-sm">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-ink-muted">اسم الحساب</span>
                              <span className="font-semibold text-ink">
                                {bank.accountName}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-ink-muted">رقم الحساب</span>
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 font-semibold text-henna"
                                dir="ltr"
                                onClick={(e) => {
                                  e.preventDefault();
                                  copyText("رقم الحساب", bank.accountNumber);
                                }}
                              >
                                {bank.accountNumber}
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-ink-muted">العملة</span>
                              <span className="font-semibold text-ink">
                                {bank.currency}
                              </span>
                            </div>
                            {bank.iban && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-ink-muted">IBAN</span>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-henna"
                                  dir="ltr"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyText("IBAN", bank.iban!);
                                  }}
                                >
                                  {bank.iban}
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-ink-light">
                واتساب المتجر:{" "}
                <span dir="ltr">{storeContact.whatsappDisplay}</span>
              </p>
            </SectionCard>
          )}

          {step === "review" && resolvedAddress && (
            <SectionCard title="مراجعة الطلب" subtitle="تأكدي من كل شيء قبل الإرسال">
              <div className="space-y-4 text-sm">
                <div className="rounded-2xl bg-cream-50 p-4">
                  <p className="font-bold text-ink">العميلة</p>
                  <p className="mt-1 text-ink-muted">
                    {customer.name} ·{" "}
                    <span dir="ltr">{customer.phone}</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-cream-50 p-4">
                  <p className="font-bold text-ink">
                    العنوان · {addressLabelText[resolvedAddress.label]}
                  </p>
                  <p className="mt-1 text-ink-muted">
                    {resolvedAddress.governorate}، {resolvedAddress.city}،{" "}
                    {resolvedAddress.area}
                  </p>
                  <p className="text-ink-muted">
                    {resolvedAddress.street}
                    {resolvedAddress.details
                      ? ` — ${resolvedAddress.details}`
                      : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-light" dir="ltr">
                    {resolvedAddress.phone}
                  </p>
                  {resolvedAddress.geo && (
                    <p className="mt-1 text-xs text-ink-light" dir="ltr">
                      {resolvedAddress.geo}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl bg-cream-50 p-4">
                  <p className="font-bold text-ink">التوصيل والدفع</p>
                  <p className="mt-1 text-ink-muted">
                    {delivery.name} (
                    {deliveryFee === 0
                      ? "مجاني"
                      : formatPriceShort(deliveryFee)}
                    )
                  </p>
                  <p className="text-ink-muted">
                    تحويل بنكي ·{" "}
                    {bankAccounts.find((b) => b.id === selectedBankId)?.bankName}
                  </p>
                </div>

                <ul className="divide-y divide-cream-200 rounded-2xl border border-cream-200">
                  {available.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">
                          {product.shortName ?? product.name}
                        </p>
                        <p className="text-xs text-ink-muted">
                          الكمية: {quantity} · {formatPriceShort(product.price)}
                        </p>
                      </div>
                      <p className="shrink-0 font-bold text-ink">
                        {formatPriceShort(product.price * quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="space-y-2 rounded-2xl bg-cream-50 p-4">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">المنتجات</dt>
                    <dd className="font-semibold">
                      {formatPriceShort(subtotal)}
                    </dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-ink-muted">الخصم</dt>
                      <dd className="font-semibold text-emerald-700">
                        −{formatPriceShort(discount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-ink-muted">التوصيل</dt>
                    <dd className="font-semibold">
                      {deliveryFee === 0
                        ? "مجاني"
                        : formatPriceShort(deliveryFee)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-cream-200 pt-2 text-base">
                    <dt className="font-bold text-ink">الإجمالي (YER)</dt>
                    <dd className="font-bold text-henna">
                      {formatPriceShort(total)}
                    </dd>
                  </div>
                </dl>

                <p className="text-xs leading-relaxed text-ink-light">
                  بالضغط على «تأكيد الطلب» سيتم حفظ الطلب محليًا، وتفريغ السلة.
                  بعدها أكملي التحويل وأرسلي الإيصال عبر واتساب.
                </p>
              </div>
            </SectionCard>
          )}

          {/* Desktop / tablet actions */}
          <div className="hidden flex-col-reverse gap-3 sm:flex sm:flex-row sm:justify-between">
            {stepIndex > 0 ? (
              <button type="button" className="btn-outline min-h-12" onClick={goBack}>
                رجوع
              </button>
            ) : (
              <Link href="/cart" className="btn-outline min-h-12 text-center">
                العودة إلى السلة
              </Link>
            )}

            {step === "review" ? (
              <button
                type="button"
                className="btn-primary min-h-12 min-w-[10rem]"
                disabled={submitting}
                onClick={confirmOrder}
              >
                تأكيد الطلب
              </button>
            ) : (
              <button type="button" className="btn-primary min-h-12 min-w-[8rem]" onClick={goNext}>
                التالي
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard
            rows={available}
            subtotal={subtotal}
            discount={discount}
            deliveryFee={step === "customer" || step === "address" ? 0 : deliveryFee}
            total={
              step === "customer" || step === "address"
                ? subtotal
                : total
            }
          />
          {(step === "customer" || step === "address") && (
            <p className="mt-2 hidden text-center text-[11px] text-ink-light sm:block">
              رسوم التوصيل تُحسب بعد اختيار طريقة التوصيل
            </p>
          )}
        </div>
      </div>

      {/* Sticky mobile checkout actions — thumb-friendly */}
      <div className="sticky-cta-bar sm:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-2.5">
          {stepIndex > 0 ? (
            <button type="button" className="btn-outline min-h-12 flex-1" onClick={goBack}>
              رجوع
            </button>
          ) : (
            <Link href="/cart" className="btn-outline min-h-12 flex-1 text-center">
              السلة
            </Link>
          )}
          {step === "review" ? (
            <button
              type="button"
              className="btn-primary min-h-12 flex-[1.6] text-base"
              disabled={submitting}
              onClick={confirmOrder}
            >
              تأكيد الطلب
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary min-h-12 flex-[1.6] text-base"
              onClick={goNext}
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
