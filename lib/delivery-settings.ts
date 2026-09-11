import type { DeliveryOption } from "./types";
import type { StoreSettings } from "./admin/ops-types";
import { deliveryOptions as seedDelivery } from "./data/checkout";

export type ResolvedDeliveryCopy = {
  deliveryLabel: string;
  deliveryText: string;
  deliveryEta: string;
  pickupEnabled: boolean;
  pickupLabel: string;
  pickupText: string;
  minDays: number;
  maxDays: number;
};

function arabicDayRange(min: number, max: number): string {
  if (min === max) return `${min} يوم عمل`;
  return `${min}–${max} أيام عمل`;
}

export function resolveDeliveryCopy(
  settings?: Partial<StoreSettings> | null
): ResolvedDeliveryCopy {
  const minDays = settings?.deliveryMinDays && settings.deliveryMinDays > 0
    ? settings.deliveryMinDays
    : 2;
  const maxDays = settings?.deliveryMaxDays && settings.deliveryMaxDays >= minDays
    ? settings.deliveryMaxDays
    : Math.max(minDays, 5);
  const deliveryEta = arabicDayRange(minDays, maxDays);
  return {
    minDays,
    maxDays,
    deliveryLabel: settings?.deliveryLabel?.trim() || "التوصيل إلى عنوانك",
    deliveryText:
      settings?.deliveryText?.trim() ||
      `${deliveryEta} · يمكن ضبط المدة من إعدادات المتجر`,
    deliveryEta,
    pickupEnabled: settings?.pickupEnabled !== false,
    pickupLabel: settings?.pickupLabel?.trim() || "استلام من المتجر",
    pickupText:
      settings?.pickupText?.trim() ||
      "مجاني · جاهز خلال وقت قصير بعد تأكيد الطلب",
  };
}

/** Build checkout delivery options from admin settings (fees still from seed). */
export function buildDeliveryOptions(
  settings?: Partial<StoreSettings> | null
): DeliveryOption[] {
  const copy = resolveDeliveryCopy(settings);
  const standardSeed = seedDelivery.find((d) => d.id === "standard") ?? seedDelivery[0];
  const pickupSeed = seedDelivery.find((d) => d.id === "pickup");
  const list: DeliveryOption[] = [
    {
      id: "standard",
      name: copy.deliveryLabel,
      description: copy.deliveryText,
      fee: standardSeed.fee,
      eta: copy.deliveryEta,
    },
  ];
  if (copy.pickupEnabled && pickupSeed) {
    list.push({
      id: "pickup",
      name: copy.pickupLabel,
      description: copy.pickupText,
      fee: 0,
      eta: copy.pickupText,
    });
  }
  return list;
}
