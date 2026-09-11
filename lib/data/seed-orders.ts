import type { Order } from "../types";
import { mockSavedAddresses } from "./checkout";

const home = mockSavedAddresses[0];
const work = mockSavedAddresses[1];

/**
 * Demo orders so طلباتي looks populated before the user places one.
 * IDs stay below the checkout sequence start (125) so getNextOrderId stays correct.
 */
export const seedOrders: Order[] = [
  {
    id: "ORD-2026-00118",
    createdAt: "2026-08-28T10:15:00.000Z",
    status: "delivered",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-kuraimi",
    items: [
      {
        productId: "prod-001",
        name: "نقشة الياسمين الذهبي",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        price: 4500,
        compareAtPrice: 5500,
        quantity: 2,
      },
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
    subtotal: 21500,
    discount: 2000,
    total: 21000,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00119",
    createdAt: "2026-09-02T14:40:00.000Z",
    status: "out_for_delivery",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-yemen",
    items: [
      {
        productId: "prod-003",
        name: "زخرفة الأصابع الحريرية",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        price: 3800,
        quantity: 3,
      },
    ],
    subtotal: 11400,
    discount: 0,
    total: 12900,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00120",
    createdAt: "2026-09-05T09:05:00.000Z",
    status: "preparing",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: work,
    deliveryMethodId: "pickup",
    deliveryFee: 0,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-tadhamon",
    items: [
      {
        productId: "prod-001",
        name: "نقشة الياسمين الذهبي",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        price: 4500,
        compareAtPrice: 5500,
        quantity: 1,
      },
      {
        productId: "prod-004",
        name: "سوار الكاحل المرصّع",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
        price: 5200,
        quantity: 2,
      },
    ],
    subtotal: 14900,
    discount: 1000,
    total: 13900,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00121",
    createdAt: "2026-09-07T16:20:00.000Z",
    status: "payment_review",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
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
    notes: "بانتظار مراجعة إيصال التحويل",
    isSeed: true,
  },
  {
    id: "ORD-2026-00122",
    createdAt: "2026-09-08T11:00:00.000Z",
    status: "ready_for_delivery",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
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
        quantity: 2,
      },
      {
        productId: "prod-006",
        name: "مجموعة ليلة الحنّاء",
        image:
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
        price: 6800,
        quantity: 1,
      },
    ],
    subtotal: 15000,
    discount: 0,
    total: 16500,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00110",
    createdAt: "2026-08-12T08:30:00.000Z",
    status: "cancelled",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-yemen",
    items: [
      {
        productId: "prod-003",
        name: "زخرفة الأصابع الحريرية",
        image:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        price: 3800,
        quantity: 1,
      },
    ],
    subtotal: 3800,
    discount: 0,
    total: 5300,
    currency: "YER",
    notes: "أُلغي بناءً على طلب العميلة",
    isSeed: true,
  },
  {
    id: "ORD-2026-00123",
    createdAt: "2026-09-09T19:45:00.000Z",
    status: "pending_payment",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: work,
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-kuraimi",
    items: [
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
    subtotal: 4500,
    discount: 1000,
    total: 5000,
    currency: "YER",
    isSeed: true,
  },
  {
    id: "ORD-2026-00124",
    createdAt: "2026-09-06T12:10:00.000Z",
    status: "payment_confirmed",
    customer: { name: "سارة أحمد", phone: "777123456" },
    address: home,
    deliveryMethodId: "standard",
    deliveryFee: 1500,
    paymentMethodId: "bank_transfer",
    bankAccountId: "bank-tadhamon",
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
    subtotal: 17000,
    discount: 3500,
    total: 15000,
    currency: "YER",
    isSeed: true,
  },
];
