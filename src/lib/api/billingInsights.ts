import { apiGet } from "@/lib/api/client";
import type { ApiResponse, PaginationMeta } from "@/lib/api/types";

export type PaymentMode = "cash" | "card" | "upi" | "other";

export interface BillingInsightsSummary {
  netInView: number;
  transactionsInView: number;
  topPaymentMode: PaymentMode | null;
}

export interface BillingInsightsTransaction {
  billId: string;
  dateTime: string; // pre-formatted "05 Apr 2026, 05:45 pm"
  store: string;
  user: string | null;
  userId: string | null;
  role: string | null;
  mode: PaymentMode;
  amount: number;
  net: number;
}

export interface BillingInsightsBreakdownByStore {
  storeId: number | null;
  name: string;
  bills: number;
  collected: number;
}

export interface BillingInsightsBreakdownByUser {
  userId: string | null;
  name: string;
  role: string | null;
  store: string;
  bills: number;
  collected: number;
}

export interface BillingInsightsBreakdownByPayment {
  paymentMode: PaymentMode;
  bills: number;
  collected: number;
}

export type BillingInsightsBreakdown =
  | BillingInsightsBreakdownByStore[]
  | BillingInsightsBreakdownByUser[]
  | BillingInsightsBreakdownByPayment[];

export interface BillingInsightsData {
  summary: BillingInsightsSummary;
  transactions: BillingInsightsTransaction[];
  breakdown?: BillingInsightsBreakdown;
}

export interface BillingInsightsResponse extends ApiResponse<BillingInsightsData> {
  pagination: PaginationMeta;
}

export interface BillingInsightsQueryParams {
  store?: string;
  userName?: string;
  paymentMode?: PaymentMode;
  breakdownBy?: "store" | "user" | "payment_mode";
  page?: number;
  limit?: number;
  search?: string;
}

function buildSearchParams(params: BillingInsightsQueryParams): URLSearchParams {
  const sp = new URLSearchParams();
  if (params.store) sp.set("store", params.store);
  if (params.userName) sp.set("userName", params.userName);
  if (params.paymentMode) sp.set("paymentMode", params.paymentMode);
  if (params.breakdownBy) sp.set("breakdownBy", params.breakdownBy);
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  return sp;
}

export async function getBillingInsights(
  params: BillingInsightsQueryParams = {},
): Promise<BillingInsightsResponse> {
  const qs = buildSearchParams(params).toString();
  return apiGet<BillingInsightsResponse>(`/insights/billing${qs ? `?${qs}` : ""}`);
}
