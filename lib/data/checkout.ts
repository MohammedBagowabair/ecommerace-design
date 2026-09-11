import type { Address, BankAccount, DeliveryOption } from "../types";

export const storeContact = {
  whatsapp: "967700000000",
  whatsappDisplay: "+967 700 000 000",
};

export const deliveryOptions: DeliveryOption[] = [
  {
    id: "standard",
    name: "التوصيل العادي",
    description: "توصيل إلى عنوانك عبر شركاء الشحن المحليين",
    fee: 1500,
    eta: "٢–٥ أيام عمل",
  },
  {
    id: "pickup",
    name: "استلام من المتجر",
    description: "استلمي طلبك من مقر نقشات (صنعاء — حدة)",
    fee: 0,
    eta: "جاهز خلال ٢٤ ساعة",
  },
];

export const bankAccounts: BankAccount[] = [
  {
    id: "bank-kuraimi",
    bankName: "بنك الكريمي",
    accountName: "نقشات للتجارة",
    accountNumber: "123456789012",
    currency: "ريال يمني (YER)",
  },
  {
    id: "bank-yemen",
    bankName: "بنك اليمن والكويت",
    accountName: "نقشات للتجارة",
    accountNumber: "987654321098",
    currency: "ريال يمني (YER)",
    iban: "YE00 0000 0000 0000 0000 00",
  },
  {
    id: "bank-tadhamon",
    bankName: "بنك التضامن الإسلامي",
    accountName: "نقشات للتجارة",
    accountNumber: "456789012345",
    currency: "ريال يمني (YER)",
  },
];

export const yemenGovernorates = [
  "صنعاء",
  "عدن",
  "تعز",
  "الحديدة",
  "إب",
  "ذمار",
  "حضرموت",
  "مأرب",
  "المحويت",
  "عمران",
  "حجة",
  "لحج",
  "أبين",
  "شبوة",
  "الجوف",
  "البيضاء",
  "الضالع",
  "ريمة",
  "سقطرى",
];

/** Mock saved addresses for returning customers */
export const mockSavedAddresses: Address[] = [
  {
    id: "addr-home-1",
    label: "home",
    governorate: "صنعاء",
    city: "صنعاء",
    area: "حدة",
    street: "شارع الستين الجنوبي",
    details: "بجانب صيدلية النور — الدور الثاني",
    phone: "777123456",
    geo: "15.3181, 44.1870",
  },
  {
    id: "addr-work-1",
    label: "work",
    governorate: "صنعاء",
    city: "صنعاء",
    area: "السبعين",
    street: "شارع تعز",
    details: "مبنى الأعمال، مكتب 4",
    phone: "733987654",
  },
];

export const addressLabelText: Record<Address["label"], string> = {
  home: "المنزل",
  work: "العمل",
};

export const bankTransferNote =
  "بعد إتمام التحويل، يرجى إرسال صورة إيصال التحويل عبر الواتساب.";
