/**
 * Matches `computeItemDiscount` in Matha-Chickens-BE `offline_bills/post.ts`
 * (`percentage` | `fixed` only; other values => 0).
 */
export function computeItemDiscount(
  price: number,
  discountType: string | null | undefined,
  discountValue: number,
): number {
  const t = discountType ?? "none";
  if (t === "percentage") return (price * discountValue) / 100;
  if (t === "fixed") return discountValue;
  return 0;
}

/** Short label for UI, e.g. "10% off" or "₹5 off" */
export function describeItemDiscountLabel(
  discountType: string | null | undefined,
  discountValue: number,
  formatInr: (n: number) => string,
): string {
  const t = discountType ?? "none";
  if (t === "percentage" && discountValue > 0) return `${discountValue}% off`;
  if (t === "fixed" && discountValue > 0) {
    return `${formatInr(discountValue)} off`;
  }
  return "";
}
