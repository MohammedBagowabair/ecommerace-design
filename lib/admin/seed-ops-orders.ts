import type { Order } from "../types";
import { mockSavedAddresses } from "../data/checkout";

const home = mockSavedAddresses[0];
const work = mockSavedAddresses[1];

/**
 * Extra admin-facing demo orders with diverse customers.
 * Kept separate from storefront account seeds (Sara) so حسابي stays coherent.
 */
export const adminExtraOrders: Order[] = [
  {
    id: "ORD-2026-00101",
    createdAt: "2026-08-20T09:00:00.000Z",
    status: "delivered",
    customer: { name: "نورة الحنّاء", phone: "733111222" },
    address: { ...home, id: "addr-noura", phone: "733111222" },
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-kuraimi",
    items: [
      {
        productId: "prod-002",
        name: "تاج العروس الملكي",
        image:
          "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
        price: 12500,
        compareAtPrice: 15000,
        quantity: 1,
      },
    ],
    subtotal: 12500,
    discount: 2500,
    total: 11500,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00105",
    createdAt: "2026-09-01T13:20:00.000Z",
    status: "preparing",
    customer: { name: "فاطمة اليمنية", phone: "770888999" },
    address: { ...work, id: "addr-fatima", phone: "770888999" },
    deliveryMethodId: "pickup",
    deliveryFee: 0,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-tadhamon",
    items: [
      {
        productId: "prod-003",
        name: "زخرفة الأصابع الحريرية",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        price: 2800,
        quantity: 4,
      },
      {
        productId: "prod-001",
        name: "نقشة الياسمين الذهبي",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        price: 4500,
        compareAtPrice: 5500,
        quantity: 1,
      },
    ],
    subtotal: 15700,
    discount: 1000,
    total: 14700,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00108",
    createdAt: "2026-09-04T18:10:00.000Z",
    status: "payment_review",
    customer: { name: "ريم التسويق", phone: "739000111" },
    address: { ...home, id: "addr-reem", phone: "739000111", area: "السنينة" },
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-yemen",
    items: [
      {
        productId: "prod-006",
        name: "مجموعة ليلة الحنّاء",
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
        price: 6800,
        quantity: 2,
      },
    ],
    subtotal: 13600,
    discount: 0,
    total: 15100,
    currency: "YER",
    notes: "بانتظار إيصال التحويل",
    isSeed: true,
  },
  {
    id: "ORD-2026-00112",
    createdAt: "2026-09-08T07:45:00.000Z",
    status: "preparing",
    customer: { name: "هدى التقارير", phone: "712345678" },
    address: { ...home, id: "addr-huda", phone: "712345678", city: "تعز", governorate: "تعز" },
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-kuraimi",
    items: [
      {
        productId: "prod-004",
        name: "سوار الكاحل المرصّع",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        price: 5200,
        quantity: 1,
      },
    ],
    subtotal: 5200,
    discount: 0,
    total: 6700,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00115",
    createdAt: "2026-09-10T11:30:00.000Z",
    status: "pending_payment",
    customer: { name: "نورة الحنّاء", phone: "733111222" },
    address: { ...home, id: "addr-noura-2", phone: "733111222" },
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-kuraimi",
    items: [
      {
        productId: "prod-005",
        name: "ورقة النخيل البسيطة",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        price: 4100,
        quantity: 3,
      },
    ],
    subtotal: 12300,
    discount: 0,
    total: 13800,
    currency: "YER",
    isSeed: true,
  },
];
