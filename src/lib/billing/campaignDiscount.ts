import type { ActiveCampaignDiscount } from "@/lib/api/discounts";

/** Matches Matha-Chickens-BE `computeCampaignDiscount` (ex-GST subtotal). */
export function computeCampaignDiscount(
  subtotal: number,
  discount: ActiveCampaignDiscount | null,
): number {
  if (!discount) return 0;
  if (discount.discount_type === "percentage") {
    return (subtotal * discount.discount_value) / 100;
  }
  if (discount.discount_type === "flat") return discount.discount_value;
  return 0;
}
