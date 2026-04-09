import { useQuery } from "@tanstack/react-query";
import {
  getBillingInsights,
  type BillingInsightsBreakdownByPayment,
  type BillingInsightsBreakdownByStore,
  type BillingInsightsBreakdownByUser,
  type BillingInsightsData,
  type BillingInsightsQueryParams,
  type PaymentMode,
} from "@/lib/api/billingInsights";

export const billingInsightsKeys = {
  all: ["billing-insights"] as const,
  list: (params: BillingInsightsQueryParams) => [
    "billing-insights",
    "list",
    params,
  ] as const,
};

export function useBillingInsights(params: BillingInsightsQueryParams) {
  return useQuery({
    queryKey: billingInsightsKeys.list(params),
    queryFn: () => getBillingInsights(params),
  });
}

// Derived types for the UI component's internal shapes
export type ByStoreRow = {
  storeId: number | null;
  storeName: string;
  bills: number;
  collected: number;
};

export type ByUserRow = {
  userId: string | null;
  userName: string;
  bills: number;
  storeName: string;
  collected: number;
};

export type ByPaymentRow = {
  mode: PaymentMode;
  bills: number;
  collected: number;
  share: number;
};

function isStoreBreakdownRow(
  value: unknown,
): value is BillingInsightsBreakdownByStore {
  if (!value || typeof value !== "object") return false;
  return "name" in value && "collected" in value && "storeId" in value;
}

function isUserBreakdownRow(
  value: unknown,
): value is BillingInsightsBreakdownByUser {
  if (!value || typeof value !== "object") return false;
  return "name" in value && "collected" in value && "store" in value;
}

function isPaymentBreakdownRow(
  value: unknown,
): value is BillingInsightsBreakdownByPayment {
  if (!value || typeof value !== "object") return false;
  return "paymentMode" in value && "collected" in value;
}

export function transformBreakdownByStore(
  data: BillingInsightsData["breakdown"],
): ByStoreRow[] {
  if (!data || !Array.isArray(data)) return [];
  return data.filter(isStoreBreakdownRow).map((row) => ({
    storeId: row.storeId,
    storeName: row.name,
    bills: row.bills,
    collected: row.collected,
  }));
}

export function transformBreakdownByUser(
  data: BillingInsightsData["breakdown"],
): ByUserRow[] {
  if (!data || !Array.isArray(data)) return [];
  return data.filter(isUserBreakdownRow).map((row) => ({
    userId: row.userId,
    userName: row.name,
    bills: row.bills,
    storeName: row.store,
    collected: row.collected,
  }));
}

export function transformBreakdownByPayment(
  data: BillingInsightsData["breakdown"],
): ByPaymentRow[] {
  if (!data || !Array.isArray(data)) return [];
  const rows = data.filter(isPaymentBreakdownRow).map((row) => ({
    mode: row.paymentMode,
    bills: row.bills,
    collected: row.collected,
  }));
  const total = rows.reduce((sum, row) => sum + row.collected, 0) || 1;
  return rows.map((x) => ({
    ...x,
    share: Math.round((x.collected / total) * 100),
  }));
}
