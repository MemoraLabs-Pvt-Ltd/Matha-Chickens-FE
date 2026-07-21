import type { Store } from "@/lib/api/stores";
import type { ActiveCampaignDiscount } from "@/lib/api/discounts";
import { computeCampaignDiscount } from "@/lib/billing/campaignDiscount";
import { computeItemDiscount } from "@/lib/billing/itemDiscount";

/**
 * Mirrors `Matha-Chickens-BE/src/controllers/offline_bills/post.ts` `isStoreTaxApplicable`.
 */
export function isStoreTaxApplicable(
  store: Pick<Store, "is_tax_applicable"> | null | undefined,
): boolean {
  if (!store) return false;
  const v = store.is_tax_applicable as unknown;
  if (v === true) return true;
  if (v === false) return false;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "t";
  return Boolean(v);
}

/** Mirrors offline bill body `discount_type` / `discount_value` (additional discount on ex-GST subtotal). */
export type OfflineBillRequestExtraDiscountType = "none" | "percentage" | "fixed";

export function computeAdditionalDiscount(
  subtotal: number,
  discountType: OfflineBillRequestExtraDiscountType,
  discountValue: number,
): number {
  if (discountType === "percentage") return (subtotal * discountValue) / 100;
  if (discountType === "fixed") return discountValue;
  return 0;
}

/** Mirrors vendor block in `createOfflineBill` (ex-GST subtotal). */
export function computeVendorDiscount(
  subtotal: number,
  vendor: {
    discount_type: "none" | "percentage" | "flat";
    discount_value: number;
  } | null | undefined,
): number {
  if (!vendor) return 0;
  if (vendor.discount_type === "percentage") {
    return (subtotal * Number(vendor.discount_value)) / 100;
  }
  if (vendor.discount_type === "flat") return Number(vendor.discount_value);
  return 0;
}

export function computeStoreDiscount(
  subtotal: number,
  store: Pick<Store, "enable_discount" | "discount_percent"> | null | undefined,
): number {
  if (store?.enable_discount === true) {
    return (subtotal * Number(store.discount_percent)) / 100;
  }
  return 0;
}

/** Per-line GST-inclusive total after item-level discount (same as BE `computedItems[].total`). */
export function computeLineGrossTotal(
  price: number,
  discountType: string | null | undefined,
  discountValue: number,
  quantity: number,
): number {
  const discountPerUnit = computeItemDiscount(price, discountType, discountValue);
  return (price - discountPerUnit) * quantity;
}

/** Same breakdown as BE `computedItems` + ex-GST/tax split. */
export function computeCartLineDetails(
  price: number,
  gstPercent: number,
  discountType: string | null | undefined,
  discountValue: number,
  quantity: number,
) {
  const discountPerUnit = computeItemDiscount(price, discountType, discountValue);
  const grossTotal = (price - discountPerUnit) * quantity;
  const baseTotal = computeBaseFromGross(grossTotal, gstPercent);
  const gstTotal = grossTotal - baseTotal;
  return { discountPerUnit, grossTotal, baseTotal, gstTotal };
}

export function computeBaseFromGross(grossTotal: number, gstPercent: number): number {
  return (grossTotal * 100) / (100 + gstPercent);
}

export function computeGstFromGross(grossTotal: number, gstPercent: number): number {
  const base = computeBaseFromGross(grossTotal, gstPercent);
  return grossTotal - base;
}

/**
 * Mirrors `createOfflineBill`: subtotal = sum of ex-GST bases; tax = sum of GST parts when applicable, else 0.
 */
export function computeSubtotalAndTaxFromGrossLines(
  lines: Array<{ grossTotal: number; gstPercent: number }>,
  taxApplicable: boolean,
): { subtotal: number; tax: number } {
  let subtotal = 0;
  let tax = 0;
  for (const i of lines) {
    const base = computeBaseFromGross(i.grossTotal, i.gstPercent);
    subtotal += base;
    if (taxApplicable) {
      tax += i.grossTotal - base;
    }
  }
  return { subtotal, tax };
}

/**
 * Mirrors `totalAmount = subtotal - discount + tax` where
 * `discount = storeDiscount + campaign + additional + vendor`.
 */
export function computeOfflineBillTotalAmount(
  subtotal: number,
  tax: number,
  storeDiscount: number,
  campaignDiscount: number,
  additionalDiscount: number,
  vendorDiscount: number,
): number {
  const discount =
    storeDiscount + campaignDiscount + additionalDiscount + vendorDiscount;
  return subtotal - discount + tax;
}

export function computeCampaignDiscountFromApi(
  subtotal: number,
  active: ActiveCampaignDiscount | null | undefined,
): number {
  return computeCampaignDiscount(subtotal, active ?? null);
}

export interface BirdPricingCategory {
  avgPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

/**
 * Mirrors the bird-pricing fallback added to `orders/post.ts` and
 * `offline_bills/post.ts`: a whole bird is priced by its category's
 * avg/min/max price (set only for bird categories such as Nati), not by
 * the item's own per-kg rate. Only applies when the item's own unit is
 * "Bird" — the category may also contain non-bird items (Kg, Nos, etc.)
 * that must keep their own price. Falls back to `itemPrice` otherwise, or
 * when the category has no bird pricing set.
 */
export function resolveItemPrice(
  itemPrice: number,
  itemUnit: string,
  category: BirdPricingCategory | null | undefined,
): number {
  if (!category) return itemPrice;
  if (itemUnit.trim().toLowerCase() !== "bird") return itemPrice;
  const birdPrice = category.avgPrice ?? category.minPrice ?? category.maxPrice;
  return birdPrice ?? itemPrice;
}
